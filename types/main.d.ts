export default main;
declare function main(cfg?: {
    logLevel: number;
}): {
    hide: (endSteps?: number | string) => Promise<any>;
    listShortcuts: (sceneName: string) => (Array<string> | null);
    setScenes: (list: import("./methods/setScenes.js").sceneDescription[]) => void;
    show: ({ scene: requestedScene, options }: {
        scene: string;
        options?: {
            ssr: boolean;
        };
    }, ...args?: any[]) => Promise<any>;
    jump: ({ scene }: {
        scene: string;
    }, ...args?: any[]) => Promise<any>;
    jumpBack: ({ hops }?: {
        hops?: number;
    }, ...args?: any[]) => Promise<any> | undefined;
    jumpsReset: () => void;
    loadPlugins(plugins: Array<"Key" | "Click" | "Form">): Promise<Function[]>;
    setDependencies(deps: any): void;
    getDependencies(): any;
    setNote(note: string): any;
    listScenes(): Array<string>;
    enablePlugin(plugin: Function, options?: any): void;
    disablePlugin(pluginName: string): void;
    emit(event: string, ...args: any[]): void;
};
//# sourceMappingURL=main.d.ts.map