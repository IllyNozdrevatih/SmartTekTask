import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'

class BaseModel {
    constructor( name ) {
        this.name = name
        this.scene = null
    }
}
// global variables
const skullModel = new BaseModel('OSG_Scene');
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = '#fff'

/**
 * Models
 */
const GLTFloader = new GLTFLoader();

/**
 * Scull Model
 */
const addScullModel = ( function (x = 0,y , z = 0){
    GLTFloader.load( '/gltf/scene.gltf', function ( model ) {
        model.scene.scale.set(0.1, 0.1, 0.1);
        model.scene.position.x = x
        model.scene.position.y = y
        model.scene.position.z = z


        model.scene.traverse( function( node ) {
            if ( node.isMesh || node.isLight ) node.castShadow = true;
            if ( node.isMesh || node.isLight ) node.receiveShadow = false;
        } );

        scene.add(model.scene)
    }, undefined, function ( error ) {
        console.error( error );
    } )
} );
addScullModel(0, 0.13)
/**
 * Objects
 */
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

const planeGeometry = new  THREE.PlaneGeometry(0.25,0.25,1)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true;

plane.rotation.x = Math.PI * 0.5 * -1;

scene.add(plane)


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

directionalLight.castShadow = true; // default false
directionalLight.shadow.mapSize.width = 512 * 3
directionalLight.shadow.mapSize.height = 512 * 3

gui.add(directionalLight.position,'x').min(-5).max(5).step(0.05).name('directional x')
gui.add(directionalLight.position,'y').min(0).max(5).step(0.05).name('directional y')
gui.add(directionalLight.position,'z').min(-5).max(5).step(0.05).name('directional z')

scene.add(directionalLight);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0.4, 0.4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI/2;
controls.minDistance = 0.2;
controls.maxDistance = 0.7;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()