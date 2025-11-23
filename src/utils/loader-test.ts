import { animate, svg, createTimer } from 'animejs';

export function runAnim() {
    const [stroke] = svg.createDrawable('#kd-stroke');
    const fill = document.querySelector<SVGPathElement>('#kd-fill');
    const svgRoot = document.querySelector<SVGSVGElement>('#kd-svg');

    if (!stroke || !fill || !svgRoot) return;

    // ============================
    // CONFIGURATION
    // ============================
    const config = {
        strokeDrawDuration: 1500,
        fillFadeDelay: 250,
        fillFadeDuration: 500,

        strokeEasing: 'easeInOutQuad',
        fadeEasing: 'easeOutSine',

        exitDelay: 1500,

        scaleUpAmount: 1.1,
        scaleUpDuration: 150,
        scaleDownDuration: 250,
        scaleEasing: 'easeInOutQuart',
    };

    // ============================
    // INITIAL STATES
    // ============================
    stroke.style.opacity = '1'; // stroke always visible
    fill.style.opacity = '0';   // fill fades in
    svgRoot.style.transformOrigin = '50% 50%';
    svgRoot.style.transform = 'scale(1)';

    // ============================
    // 1. Stroke draws in
    // ============================
    animate(stroke, {
        draw: ['0.5 0.5', '0 1'],
        duration: config.strokeDrawDuration,
        easing: config.strokeEasing,
    });

    // ============================
    // 2. Fill fades in
    // ============================
    createTimer({
        duration: config.strokeDrawDuration + config.fillFadeDelay,
        onComplete: () => {
            animate(fill, {
                opacity: [0, 1],
                duration: config.fillFadeDuration,
                easing: config.fadeEasing,
            });
        },
    });

    // ============================
    // 3. Exit animation
    // ============================
    createTimer({
        duration:
            config.strokeDrawDuration +
            config.fillFadeDelay +
            config.fillFadeDuration +
            config.exitDelay,
        onComplete: () => {
            animate(svgRoot, {
                scale: [1, config.scaleUpAmount],
                duration: config.scaleUpDuration,
                easing: config.scaleEasing,
            }).then(() => {
                animate(svgRoot, {
                    scale: [config.scaleUpAmount, 0],
                    duration: config.scaleDownDuration,
                    easing: config.scaleEasing,
                });
            });
        },
    });
}
