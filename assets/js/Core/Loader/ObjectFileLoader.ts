export default class ObjectFileLoader {
    private static filesLoaded: boolean = false;

    constructor() {
        if (!ObjectFileLoader.filesLoaded) {
            // Copy textures files in public path
            require.context(`@js/Models`, true, /^(.*\.(jpg|dds|png$))[^.]*$/im);

            ObjectFileLoader.filesLoaded = true;
        }
    }
}
