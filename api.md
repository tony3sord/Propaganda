Rutas:

*Usuarios:
get : "/currentuser" => Devuelve el usuario actual
get : "/login" => renderiza la vista "login"
post : "/login" => hace el login con los campos (user,password)
get: "/register" => renderiza la vista "register"
post : "/register" => hace el register con los campos (name,email,user,password)
get : "/logout" => desloguea al usuario

*Productos:
get: "/products" => devuelve todos los productos 
get: "/addproduct" => renderiza la vista "addproduct" la cual es para insertar un producto
post: "/addproduct" => hace la funcion "addproduct" la cual es para insertar un producto con los campos (name,price,description,image,
category,) image es un arreglo que puedes poner hasta 3 imagenes, solo hay que hacer required una sola, las demás no son obligatorias
get: "/editproduct/:id" => renderiza la vista de editar producto el cual tambien envia en json el producto a editar(el cual debe de ser enviado por parametro, solo el id)
post: "/editproduct/:id" => edita el producto el cual debe de ser enviado por parametro(solo el id)
delete: "/removeproduct/:id" => elimina el producto, del cual envias por parametro su id