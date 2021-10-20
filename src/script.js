import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

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

const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x2fa8fe } );

const sphere1 = new THREE.Mesh( geometry, sphereMaterial );
const sphere2 = new THREE.Mesh( geometry, sphereMaterial );
const sphere3 = new THREE.Mesh( geometry, sphereMaterial );

// sphere scale
sphere1.scale.set(0.01, 0.01, 0.01)
sphere2.scale.set(0.01, 0.01, 0.01)
sphere3.scale.set(0.01, 0.01, 0.01)
// sphere position
sphere1.position.set(0.082, 0.2, 0.02)
sphere2.position.set(0, 0.147, 0.108)
sphere3.position.set(0.065, 0.11, 0)
// sphere name
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
 * Labels
 */
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

console.log('sphereLabelDiv1.style', sphereLabelDiv1.style)
const sphereLabelDiv2 = document.createElement( 'div' );
sphereLabelDiv2.className = 'label';
sphereLabelDiv2.textContent = `Label 2. ${loremText}`;
sphereLabelDiv2.style.opacity = 0

const sphereLabelDiv3 = document.createElement( 'div' );
sphereLabelDiv3.className = 'label';
sphereLabelDiv3.textContent = `Label 3.${loremText}`;
sphereLabelDiv3.style.opacity = 0

const sphereLabel1 = new CSS2DObject( sphereLabelDiv1 );
const sphereLabel2 = new CSS2DObject( sphereLabelDiv2 );
const sphereLabel3 = new CSS2DObject( sphereLabelDiv3 );

sphereLabel1.position.set( 0, 1, 0 );
sphereLabel2.position.set( 0, 1, 0 );
sphereLabel3.position.set( 0, 1, 0 );

sphere1.add( sphereLabel1 );
sphere2.add( sphereLabel2 );
sphere3.add( sphereLabel3 );

sphereLabelDiv1.style.height = '0'
sphereLabelDiv1.style.width = '0'
sphereLabelDiv2.style.height = '0'
sphereLabelDiv2.style.width = '0'
sphereLabelDiv3.style.height = '0'
sphereLabelDiv3.style.width = '0'
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0.4, 0.4)
scene.add(camera)

/**
 * Controls
 */
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
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const sphereNameLabelsMap = new Map()
sphereNameLabelsMap.set('sphere1', sphereLabelDiv1)
sphereNameLabelsMap.set('sphere2', sphereLabelDiv2)
sphereNameLabelsMap.set('sphere3', sphereLabelDiv3)

const sphereNamesArray = [...sphereNameLabelsMap.keys()]

function intersectsFunction () {
    const intersects = raycaster.intersectObjects( scene.children, false );

    if (intersects.length === 0) return ;
    if (sphereNamesArray.includes(intersects[ 0 ].object.name) === false) return ;

    if (sphereNamesArray.includes(intersects[ 0 ].object.name)){
        const sphereLabelItem = sphereNameLabelsMap.get(intersects[ 0 ].object.name)

        if ( sphereLabelItem.style.opacity === '1' ) {
            sphereLabelItem.style.opacity = 0
            sphereLabelItem.style.height = '0'
            sphereLabelItem.style.width = '0'
        } else {
            sphereLabelItem.style.opacity = 1
            sphereLabelItem.style.height = 'auto'
            sphereLabelItem.style.width = 'auto'
        }
    }
}

/**
 * Animate
 */
const tick = () =>
{
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // Update controls
    controls.update()

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
window.addEventListener('touchend', intersectsFunction);
