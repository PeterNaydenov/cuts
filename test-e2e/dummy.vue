<template>
    <div>
        <h1>Test</h1>
        <p id="target" data-target>Test <a href="#">lorem ipsum</a></p>
        <div data-region="container">
            
        </div>
        <div data-region="blue"></div>
        <div data-region="gray"></div>
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

#target,
[data-target] {
    --blue: var(--link-color);
     color: var(--blue);
}

#target a,
[data-target] a {
    color: var(--link-color);
}
</style>
