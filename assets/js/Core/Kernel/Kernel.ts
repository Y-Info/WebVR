import Application from "@js/Core/Application/Application";
import Controller from "@js/Core/Kernel/Controller";

export default class Kernel {
    constructor(private application: Application) {
        this.loadControllers();
    }

    /**
     * Instancy all application's controllers
     */
    private loadControllers(): void {
        const requireContext = require.context(`@js/Controller`, true, /^(.*\.(ts$))[^.]*$/im);

        requireContext.keys().forEach(controllerPath => {
            const controller = requireContext(controllerPath).default;
            const controllerInstance = new controller() as Controller;

            controllerInstance.run(
                this.application.scene,
                this.application.camera
            );
        });
    }
}
