export default main;
declare function main(cfg?: {
    logLevel: number;
}): {
    hide: (endSteps?: number | string) => Promise<any>;
    listShortcuts: (sceneName: string) => (Array<string> | null);
    setScenes: (list: SceneDescription[]) => void;
    show: ({ scene: requestedScene, options }: {
        scene: string;
        options?: {
            ssr: boolean;
        };
    }, ...args?: any[]) => Promise<any>;
    jump: ({ scene }: {
        scene: any;
    }, ...args: any[]) => any;
    jumpBack: ({ hops }?: {
        hops: number;
    }, ...args: any[]) => any;
    jumpsReset: () => void;
    loadPlugins(plugins: Array<"Key" | "Click" | "Form">): Promise<Function[]>;
    setDependencies(deps: any): any;
    getDependencies(): any;
    setNote(note: string): any;
    listScenes(): Array<string>;
    enablePlugin(plugin: Function, options?: any): any;
    disablePlugin(pluginName: string): any;
    emit(event: string, ...args: any[]): any;
};
//# sourceMappingURL=main.d.ts.map