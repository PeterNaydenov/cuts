declare function show(dependencies: any, state: any): ({ scene: requestedScene, options }: {
    scene: string;
    options?: {
        ssr: boolean;
    };
}, ...args?: any[]) => Promise<any>;
export default show;
//# sourceMappingURL=show.d.ts.map