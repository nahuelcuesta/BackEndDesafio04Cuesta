//configuracion se socket del lado del cliente
const socket = io();

socket.on("productosActuales", (data) => {
  console.log(data);

  const contenedorPrincipal = document.querySelector(".containerPrincipal");
  contenedorPrincipal.innerHTML = "";

  data.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");

    productoDiv.innerHTML = `
        
        <h2>${producto.title}</h2>
        <p>${producto.description}</p>
        <p>${producto.category}</p>
        <button onclick="eliminarProductoDom('${producto.id}')">Eliminar</button>
        `;
    contenedorPrincipal.appendChild(productoDiv);
  });
});

//eliminar produto 
function eliminarProductoDom(id) {      
    socket.emit('eliminarProducto', id);
}

//capturar el formulario cuando se envia
document
  .getElementById("productForm")
  .addEventListener("submit", async (evt) => {
    evt.preventDefault();

    //capturar valores del form
    const title = document.getElementById("titulo").value;
    const description = document.getElementById("descripcion").value;
    const price = document.getElementById("precio").value;
    /*         const thumbnail = document.getElementById('thumbnail').value; */
    const code = document.getElementById("codigo").value;
    const stock = document.getElementById("stock").value;
    const status = document.getElementById("disponible").checked;
    const category = document.getElementById("categoria").value;

    const productoData = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
    };

    console.log(productoData);
    document.getElementById("productForm").reset();
    socket.emit("agregarProducto", productoData);
  });
