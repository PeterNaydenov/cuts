export default main;
declare function main(cfg?: {
    logLevel: number;
}): {
    setDependencies(deps: any): any;
    getDependencies(): any;
    setNote(note: string): any;
    listScenes(): Array<string>;
    enablePlugin(plugin: Function, options: any): any;
    disablePlugin(pluginName: string): any;
    emit(event: string, ...args: any[]): any;
};
//# sourceMappingURL=main.d.ts.map