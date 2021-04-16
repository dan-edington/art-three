export default function ({ renderer, scene, camera }) {

    const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

}