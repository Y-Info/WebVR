import {Group, MaterialCreator} from "three";
import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import ObjectFileLoader from "@js/Core/Loader/ObjectFileLoader";
import ObjectCacheLoaderCollection from "@js/Collection/ObjectCacheLoaderCollection";
import EnvironmentService from "@js/Service/EnvironmentService";
import {Inject} from "typescript-ioc";
import ObjectCacheLoader from "@js/Core/Loader/ObjectCacheLoader";

export default class ObjectLoader {
    private static objectCacheCollection = new ObjectCacheLoaderCollection();
    @Inject
    private environmentService: EnvironmentService;
    private onProgressCallback: Function;

    constructor() {
        new ObjectFileLoader();

        this.onProgressCallback = xhr => {
            if (this.environmentService.isDevelopmentEnvironment()) {
                console.info(`${Math.floor(xhr.loaded / xhr.total * 100)}% loaded`);
            }
        }
    }

    /**
     * Load an 3D object with file name parameter
     * @param modelName
     */
    public load(modelName: string): Promise<Group> {
        return new Promise((resolve, reject) => {
            // Search object in cache collection
            const objectCache = ObjectLoader.objectCacheCollection.findObject(modelName);
            // If object exist in cache collection
            if (objectCache !== null) {
                // Return a clone of this object
                return resolve(objectCache.object.clone(true));
            }

            // Get .obj file content
            const objectContent = require(`@assets/models/${modelName}/${modelName}.obj`) as string,
                // Find .mtl file name in .obj
                match = /mtllib (.+)\.mtl/gi.exec(objectContent),
                // Get .mtl file name
                MTLFileName = match[1];

            // If MTL file not found in .obj
            if (!MTLFileName) {
                throw `MTL file not found in ${modelName}.obj`;
            }

            // Get .mtl file
            const textures = require(`@assets/models/${modelName}/${MTLFileName}.mtl`),
                mtlLoader = new MTLLoader();

            mtlLoader.setTexturePath('/models/');
            // Load textures in .mtl file
            mtlLoader.load(textures, (materials: MaterialCreator) => {
                materials.preload();

                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                // Create new Object3D from .obj content
                const object = objLoader.parse(objectContent);

                // Add object to cache system
                ObjectLoader.objectCacheCollection.add(new ObjectCacheLoader(modelName, object));
                resolve(object);
            }, this.onProgressCallback, error => {
                console.error(error);
                reject(error);
            });
        });
    }

    /**
     * On progress 3D model load callback
     * @param callback
     */
    public onProgress(callback: Function): void {
        this.onProgressCallback = callback;
    }
}