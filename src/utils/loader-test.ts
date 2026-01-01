import { animate, svg, createTimer } from 'animejs';

export function runAnim() {

    const [stroke] = svg.createDrawable('#kd-stroke') as [SVGPathElement];
    const fill = document.querySelector('#kd-fill') as SVGPathElement;
    const svgRoot = document.querySelector('#kd-svg') as SVGSVGElement;
    const nameEl = document.querySelector('#kd-name') as HTMLDivElement;

    if (!stroke || !fill || !svgRoot || !nameEl) return;

    // REVEAL NOW THAT JS IS RUNNING (prevents flicker)
    svgRoot.style.visibility = 'visible';
    nameEl.style.visibility = 'visible';

    // ============================
    // CONFIGURATION
    // ============================
    const config = {
        strokeDrawDuration: 1750,
        fillFadeDelay: 250,
        fillFadeDuration: 500,

        strokeEasing: 'easeInOutQuad',
        fadeEasing: 'easeOutSine',

        exitDelay: 1500,

        scaleUpAmount: 1.1,
        scaleUpDuration: 150,
        scaleDownDuration: 250,
        scaleEasing: 'easeInOutQuart',

        nameFadeInDuration: 450,
        nameFadeOutDuration: 250,
        nameFadeInEasing: 'easeOutSine',
        nameFadeOutEasing: 'easeOutSine',

        postTextDelay: 400, // delay after KD text fades out
    };

    // ============================
    // INITIAL STATES
    // ============================
    stroke.style.opacity = '1';
    fill.style.opacity = '0';

    svgRoot.style.transformOrigin = '50% 50%';
    svgRoot.style.transform = 'scale(1)';
    svgRoot.style.opacity = '0'; // fully hidden until animation starts

    nameEl.style.opacity = '0';
    nameEl.style.transform = 'none';

    // ============================
    // 1. Stroke draws in
    // ============================
    // reveal SVG instantly so stroke animation is visible
    animate(svgRoot, {
        opacity: [0, 1],
        duration: 1,
    });

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
    // 2.5 Name fade-in
    // ============================
    createTimer({
        duration:
            config.strokeDrawDuration +
            config.fillFadeDelay +
            config.fillFadeDuration -
            200,
        onComplete: () => {
            animate(nameEl, {
                opacity: [0, 1],
                duration: config.nameFadeInDuration,
                easing: config.nameFadeInEasing,
            });
        },
    });

    // ============================
    // 3. Exit phase
    // ============================
    createTimer({
        duration:
            config.strokeDrawDuration +
            config.fillFadeDelay +
            config.fillFadeDuration +
            config.exitDelay,
        onComplete: () => {
            // fade out text
            animate(nameEl, {
                opacity: [1, 0],
                duration: config.nameFadeOutDuration,
                easing: config.nameFadeOutEasing,
            });

            // AFTER fade-out + delay → logo exit
            createTimer({
                duration: config.nameFadeOutDuration + config.postTextDelay,
                onComplete: () => {

                    // KD scale-out sequence (unchanged)
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
        },
    });
}
