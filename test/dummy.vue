<template>
    <div>
        <h1>Test</h1>
        <p id="target">Test <a href="#">lorem ipsum</a></p>
        <div id="container">
            
        </div>
        <div id="blue"></div>
        <div id="gray"></div>
    </div>
</template>

<style>
:root {
    --blue: #007bff;
    --gray: #6c757d;
    --link-color: rgb(204, 51, 10);
}

body.dark {
    --background-color: #000;
    --link-color: rgb(249, 249, 249);
    background-color: var(--background-color);
}

#target {
    --blue: var(--link-color);
     color: var(--blue);
}

#target a {
    color: var(--link-color);
}
</style>
