import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
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
 * MeshStandardMaterial
 */

/**
 * Plane
 */
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

const planeGeometry = new  THREE.PlaneGeometry(0.25,0.25,1)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true;

plane.rotation.x = Math.PI * 0.5 * -1;

scene.add(plane)

/**
 * Points
 */
const geometry = new THREE.CircleGeometry( 1, 16 );
const material1 = new THREE.MeshBasicMaterial( { color: 0x2fa8fe } );
const material2 = new THREE.MeshBasicMaterial( { color: 0x2fa8fe } );
const material3 = new THREE.MeshBasicMaterial( { color: 0x2fa8fe } );
const sphere1 = new THREE.Mesh( geometry, material1 );
const sphere2 = new THREE.Mesh( geometry, material2 );
const sphere3 = new THREE.Mesh( geometry, material3 );
//scale
sphere1.scale.x = 0.01
sphere1.scale.y = 0.01
sphere1.scale.z = 0.01

sphere2.scale.x = 0.01
sphere2.scale.y = 0.01
sphere2.scale.z = 0.01

sphere3.scale.x = 0.01
sphere3.scale.y = 0.01
sphere3.scale.z = 0.01

sphere1.position.x = 0.082
sphere1.position.y = 0.2
sphere1.position.z = 0.02

sphere2.position.y = 0.147
sphere2.position.z = 0.108

sphere3.position.x = 0.065
sphere3.position.y = 0.11

sphere1.name = 'sphere1'
sphere2.name = 'sphere2'
sphere3.name = 'sphere3'

scene.add( sphere1 );
scene.add( sphere2 );
scene.add( sphere3 );

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


const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );

const loremText  = 'Lorem ipsum dolor sit amet'

const sphereLabelDiv1 = document.createElement( 'div' );
sphereLabelDiv1.className = 'label';
sphereLabelDiv1.textContent = `Label 1. ${loremText}`;
sphereLabelDiv1.style.opacity = 0

const sphereLabelDiv2 = document.createElement( 'div' );
sphereLabelDiv2.className = 'label';
sphereLabelDiv2.textContent = `Label 2. ${loremText}`;
sphereLabelDiv2.style.opacity = 0

const sphereLabelDiv3 = document.createElement( 'div' );
sphereLabelDiv3.className = 'label';
sphereLabelDiv3.textContent = `Label 3.${loremText}`;
sphereLabelDiv3.style.opacity = 0

const sphereLabel1 = new CSS2DObject( sphereLabelDiv1 );
const sphereLabel2 = new CSS2DObject( sphereLabelDiv2 )
const sphereLabel3 = new CSS2DObject( sphereLabelDiv3 )

sphereLabel1.position.set( 0, 1, 0 );
sphereLabel2.position.set( 0, 1, 0 );
sphereLabel3.position.set( 0, 1, 0 );

sphere1.add( sphereLabel1 );
sphere2.add( sphereLabel2 );
sphere3.add( sphereLabel3 );

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function intersectsFunction () {
    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {
        // case sphere1
        if (intersects[ 0 ].object.name === 'sphere1') {
            // sphereLabelDiv1.style.opacity = 0;
            if ( sphereLabelDiv1.style.opacity === '1' ) {
                sphereLabelDiv1.style.opacity = 0
            } else {
                sphereLabelDiv1.style.opacity = 1
            }
        }
        // case sphere2
        if (intersects[ 0 ].object.name === 'sphere2') {
            if ( sphereLabelDiv2.style.opacity === '1' ) {
                sphereLabelDiv2.style.opacity = 0
            } else {
                sphereLabelDiv2.style.opacity = 1
            }
        }
        // case sphere3
        if (intersects[ 0 ].object.name === 'sphere3') {
            if ( sphereLabelDiv3.style.opacity === '1' ) {
                sphereLabelDiv3.style.opacity = 0
            } else {
                sphereLabelDiv3.style.opacity = 1
            }
        }
    }
}


const tick = () =>
{
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // Update controls
    controls.update()
    // console.log('controls.target', controls)

    sphere1.lookAt(camera.position)
    sphere2.lookAt(camera.position)
    sphere3.lookAt(camera.position)

    labelRenderer.render( scene, camera );
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'mousemove', onMouseMove, false );


window.addEventListener('click', intersectsFunction)
