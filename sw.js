//IMPORTS
importScripts('js/sw-utils.js');

//1. declaro las constantes del cache

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//2. declaro el appshell que tendra todos los elementos necesarios para el funcionamiento del sitio

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//3. declaro el appshell de los inmutables (Librerias y archivos que no seran modificados jamás)

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

//4. Realizo la instalación y almaceno los app_shell creados

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });


    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

//5. Creo un evento para eliminar los cachés viejos que ya no se requieran durante la instalación

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            // static-v4
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});

//6. Configuro la estrategia Cache with Dynamic Fallback

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newResp => {
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
        }
    });

    e.respondWith(respuesta);
});