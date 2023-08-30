import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { collection,getDocs,addDoc,updateDoc,doc,getDoc,documentId,writeBatch,query,where 
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link, Navigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

// Definir un esquema de validación Yup para el formulario
const schema = Yup.object().shape({
    nombre: Yup.string()
        .min(3, "El nombre es demasiado corto")
        .max(20, "Máximo 20 caracteres")
        .required("Este campo es obligatorio"),
    direccion: Yup.string()
        .min(6, "La dirección es demasiado corta")
        .max(20, "Máximo 20 caracteres")
        .required("Este campo es obligatorio"),
    email: Yup.string()
        .required("Este campo es obligatorio")
        .email("El email es inválido")
});

const Checkout = () => {
    // Obtener el carrito, el total de compra y la función para vaciar el carrito desde el contexto
    const { cart, totalCompra, vaciarCarrito } = useContext(CartContext);

    // Estado para controlar la carga y el número de orden
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Función que maneja el envío del formulario
    const handleSubmit = async (values) => {
        setLoading(true);

        // Crear una orden con la información del cliente y los productos en el carrito
        const orden = {
            cliente: values,
            items: cart.map(item => ({id: item.id, precio: item.precio, cantidad: item.cantidad, nombre: item.nombre})),
            total: totalCompra(),
            fyh: new Date()
        }

        // Iniciar un lote de escritura para operaciones múltiples en Firebase
        const batch = writeBatch(db);
        const ordersRef = collection(db, "orders");
        const productosRef = collection(db, "productos");
        const q = query(productosRef, where(documentId(), "in", cart.map(item => item.id)));

        // Obtener la lista de productos en el carrito
        const productos = await getDocs(q);
        const outOfStock = [];

        // Recorrer los productos para comprobar el stock
        productos.docs.forEach((doc) => {
            const item = cart.find(prod => prod.id === doc.id );
            const stock = doc.data().stock;
                
            if (stock >= item.cantidad) {
                // Actualizar el stock en Firebase
                batch.update(doc.ref, {
                    stock: stock - item.cantidad
                });
            } else {
                // Agregar productos sin stock a la lista
                outOfStock.push(item);
            }
        });

        if (outOfStock.length === 0) {
            // Confirmar todas las operaciones en el lote
            await batch.commit();

            // Agregar la orden a la colección de órdenes
            const doc = await addDoc(ordersRef, orden);

            // Vaciar el carrito y guardar el número de orden
            vaciarCarrito();
            setOrderId(doc.id);
        } else {
            // Mostrar un mensaje de alerta si hay productos sin stock
            alert("Hay items sin stock");
            console.log(outOfStock);
        }

        setLoading(false);
    }

    // Si se ha completado la orden, mostrar un mensaje de confirmación
    if (orderId) {
        return (
            <div className="container my-5">
                <h2 className="text-4xl">Tu compra se registró exitosamente!</h2>
                <hr/>
                <p>Tu número de orden es: <strong>{orderId}</strong></p>

                <Link to="/">Volver</Link>
            </div>
        )
    }

    // Si el carrito está vacío, redirigir al usuario a la página principal
    if (cart.length === 0) {
        return <Navigate to="/"/>
    }

    // Renderizar el formulario de checkout utilizando Formik
    return (
        <div className="container my-5">
            <h2>Checkout</h2>
            <hr/>

            <Formik
                initialValues={{
                    nombre: '',
                    direccion: '',
                    email: ''
                }}
                onSubmit={handleSubmit}
                validationSchema={schema}
            >
                {() => (
                    <Form>
                        <Field placeholder="Tu nombre" className="form-control my-2" type="text" name="nombre"/>
                        <ErrorMessage name="nombre" component="p"/>
                        <Field placeholder="Tu direccion" className="form-control my-2" type="text" name="direccion"/>
                        <ErrorMessage name="direccion" component="p"/>
                        <Field placeholder="Tu email" className="form-control my-2" type="email" name="email"/>
                        <ErrorMessage name="email" component="p"/>
                        <button type="button"className="btn btn-success"  disabled={loading}>Enviar</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Checkout;
