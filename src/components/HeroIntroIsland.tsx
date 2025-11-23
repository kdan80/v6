import { useRef, useEffect } from "react";
import { animate, createScope } from "animejs";

export default function AnimeTest() {
    const root = useRef<HTMLDivElement>(null);
    const scope = useRef<any>(null);

    useEffect(() => {
        scope.current = createScope({ root }).add(() => {
            animate(boxEl.current, {
                translateX: 150,
                duration: 1200
            });
        });

        return () => scope.current.revert();
    }, []);

    const boxEl = useRef<HTMLDivElement>(null);

    return (
        <div ref={root} className="p-6">
            <div ref={boxEl} className="w-16 h-16 bg-blue-500 rounded" />
        </div>
    );
}
