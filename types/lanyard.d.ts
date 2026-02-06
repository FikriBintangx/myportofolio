
declare module '*.glb' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module 'meshline' {
    import { BufferGeometry, Material } from 'three';
    export class MeshLineGeometry extends BufferGeometry {
        constructor();
        setPoints(points: unknown[]): void;
    }
    export class MeshLineMaterial extends Material {
        constructor(parameters?: any);
        resolution: any;
        lineWidth: number;
        sizeAttenuation: number;
        map: any;
        useMap: number;
        alphaMap: any;
        useAlphaMap: number;
        color: any;
        opacity: number;
        transparent: boolean;
        dashArray: number;
        dashOffset: number;
        dashRatio: number;
        visibility: number;
        alphaTest: number;
        repeat: any;
    }
}

/* global JSX */
import { Object3DNode, MaterialNode } from '@react-three/fiber';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: Object3DNode<any, typeof import('meshline').MeshLineGeometry>;
            meshLineMaterial: MaterialNode<any, typeof import('meshline').MeshLineMaterial>;
        }
    }
}
