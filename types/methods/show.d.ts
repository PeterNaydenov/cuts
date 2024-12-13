export default show;
declare function show(dependencies: any, state: any): ({ scene: requestedScene, options }: {
    scene: string;
    options?: {
        ssr: boolean;
    };
}, ...args?: any[]) => Promise<any>;
//# sourceMappingURL=show.d.ts.map