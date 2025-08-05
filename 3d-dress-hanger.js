// 3D Dress Hanger with Three.js
// This script creates a 3D dress hanger that rotates and moves on scroll
// and responds to mouse movements for interactive experience

let scene, camera, renderer, hanger;
let targetRotationY = 0;
let targetRotationX = 0;
let targetPositionY = 0;
let scrollPercent = 0;
let mouseX = 0;
let mouseY = 0;

// Initialize the 3D scene
function init3DHanger() {
  // Create container for the 3D element
  const container = document.getElementById('dress-hanger-container');
  if (!container) return;

  // Get loading indicator
  const loadingIndicator = document.querySelector('.loading-indicator');

  // Set up the scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  container.appendChild(renderer.domElement);

  // Add lights optimized for the T-shirt model
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Main directional light (simulates sunlight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(1, 2, 1);
  scene.add(directionalLight);

  // Add point lights for better highlights and fabric detail
  const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 10);
  pointLight1.position.set(2, 1, 2);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xff4fa3, 0.5, 10); // Brand color light
  pointLight2.position.set(-2, 0, 1);
  scene.add(pointLight2);
  
  // Add a soft fill light from below
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(0, -1, 0);
  scene.add(fillLight);

  // Load T-shirt 3D model
  loadTshirtModel();
  
  // Create a simple hanger as a fallback in case the model fails to load
  // createSimpleHanger();

  // Hide loading indicator once the model is created
  if (loadingIndicator) {
    setTimeout(() => {
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
      }, 500);
    }, 1000); // Add a slight delay for better UX
  }

  // Position camera for better view of the T-shirt
  camera.position.z = 3;
  camera.position.y = 0.5;

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Add scroll listener
  window.addEventListener('scroll', onScroll);
  
  // Add mouse movement listener for interactivity
  document.addEventListener('mousemove', onMouseMove);
  
  // Add touch listeners for mobile devices
  document.addEventListener('touchstart', onTouchStart, false);
  document.addEventListener('touchmove', onTouchMove, false);

  // Start animation loop
  animate();
}

// Create a simple hanger shape as a placeholder
function createSimpleHanger() {
  // Create the hanger group
  hanger = new THREE.Group();
  
  // Create the hook part
  const hookGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 100, Math.PI);
  const hookMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
  const hook = new THREE.Mesh(hookGeometry, hookMaterial);
  hook.rotation.x = Math.PI;
  hook.position.y = 1.2;
  
  // Create the horizontal bar
  const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
  const barMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
  const bar = new THREE.Mesh(barGeometry, barMaterial);
  bar.rotation.z = Math.PI / 2;
  
  // Create a simple dress shape
  const dressGeometry = new THREE.ConeGeometry(1, 2, 32, 1, false, 0, Math.PI * 2);
  const dressMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff4fa3, // Match the site's primary color
    transparent: true,
    opacity: 0.8
  });
  const dress = new THREE.Mesh(dressGeometry, dressMaterial);
  dress.position.y = -1;
  dress.scale.set(0.8, 0.8, 0.4);
  
  // Add all parts to the hanger group
  hanger.add(hook);
  hanger.add(bar);
  hanger.add(dress);
  
  // Add the hanger to the scene
  scene.add(hanger);
}

// Load the T-shirt 3D model
function loadTshirtModel() {
  // Create a group for the T-shirt model
  hanger = new THREE.Group();
  scene.add(hanger);
  
  // Path to the model files
  const modelPath = 'images/tshirt/A_realistic_3D_model__0804221550_texture_obj/';
  const mtlFile = 'A_realistic_3D_model__0804221550_texture.mtl';
  const objFile = 'A_realistic_3D_model__0804221550_texture.obj';
  
  // Load material first
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath(modelPath);
  mtlLoader.load(mtlFile, function(materials) {
    materials.preload();
    
    // Load OBJ with materials
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(modelPath);
    objLoader.load(objFile, function(object) {
      // Scale and position the model appropriately
      object.scale.set(0.03, 0.03, 0.03); // Adjust scale for T-shirt
      object.position.set(0, -0.5, 0); // Position slightly lower
      object.rotation.y = Math.PI; // Rotate to face the camera
      
      // Add the loaded model to our hanger group
      hanger.add(object);
      
      // Hide loading indicator once the model is loaded
      const loadingIndicator = document.querySelector('.loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
          loadingIndicator.style.display = 'none';
        }, 500);
      }
    }, 
    // Progress callback
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    function(error) {
      console.error('Error loading OBJ model:', error);
      // If model fails to load, create the simple hanger as fallback
      createSimpleHanger();
    });
  },
  // MTL Progress callback
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded');
  },
  // MTL Error callback
  function(error) {
    console.error('Error loading MTL file:', error);
    // If materials fail to load, create the simple hanger as fallback
    createSimpleHanger();
  });
}

// Handle window resize
function onWindowResize() {
  const container = document.getElementById('dress-hanger-container');
  if (!container) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Handle scroll events
function onScroll() {
  // Calculate scroll percentage
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollPercent = scrollTop / scrollHeight || 0;
  
  // Update target rotation and position based on scroll
  targetRotationY = scrollPercent * Math.PI * 2; // Full rotation
  targetPositionY = scrollPercent * 2 - 1; // Move up and down
}

// Handle mouse movement for interactivity
function onMouseMove(event) {
  // Calculate normalized mouse position (-1 to 1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  
  // Adjust target rotation based on mouse position
  // Limit the rotation range to keep the model visible
  targetRotationX = mouseY * 0.3; // Limit vertical rotation
  targetRotationY = mouseX * Math.PI * 0.5 + (scrollPercent * Math.PI * 2);
}

// Handle touch start events for mobile
function onTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
    mouseY = (event.touches[0].pageY / window.innerHeight) * 2 - 1;
  }
}

// Handle touch move events for mobile
function onTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
    mouseY = (event.touches[0].pageY / window.innerHeight) * 2 - 1;
    
    // Adjust target rotation based on touch position
    targetRotationX = mouseY * 0.3;
    targetRotationY = mouseX * Math.PI * 0.5 + (scrollPercent * Math.PI * 2);
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (hanger) {
    // Smoothly interpolate current rotation to target rotation
    hanger.rotation.y += (targetRotationY - hanger.rotation.y) * 0.05;
    hanger.rotation.x += (targetRotationX - hanger.rotation.x) * 0.05;
    
    // Smoothly interpolate current position to target position
    hanger.position.y += (targetPositionY - hanger.position.y) * 0.05;
    
    // Add a gentle floating motion
    hanger.position.y += Math.sin(Date.now() * 0.001) * 0.005;
    
    // Add subtle breathing/movement effect to the model
    if (hanger.children.length > 0) {
      // Apply subtle scale animation to the model
      const breathingScale = Math.sin(Date.now() * 0.0015) * 0.01;
      hanger.children[0].scale.x += breathingScale;
      hanger.children[0].scale.z += breathingScale;
    }
    
    // Render the scene
    renderer.render(scene, camera);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init3DHanger);
