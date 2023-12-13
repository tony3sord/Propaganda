Rutas:

*Usuarios:
get : "/currentuser" => Devuelve el usuario actual
get : "/login" => renderiza la vista "login"
post : "/login" => hace el login con los campos (user,password)
get: "/register" => renderiza la vista "register"
post : "/register" => hace el register con los campos (name,email,user,password)
get : "/logout" => desloguea al usuario
