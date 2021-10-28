const idregistro = document.getElementById("idRegistro");
const nombre = document.getElementById("nombre");
const idvotar = document.getElementById("idvotar");
const registrar = document.getElementById("btnRegistrar");
const votar = document.getElementById("votar");
const btnCandidato = document.getElementById("btnCandidato");
const btnVotos = document.getElementById("btnVotaciones");

let validarCandidto = (i, n) => {
    if (i === "" || n === "") {
        alert("Llene los campos");
        return false;
    }
    let candidatoNuevo = true;
    db.ref("Candidatos").on("value", function (data) {
        data.forEach(function (c) {
            let valor = c.val();
            let id = valor.id;

            if (id === i) {
                candidatoNuevo = false;
            }
        });
    });

    return candidatoNuevo;
};

let Registrar = () => {
    let i = idregistro.value;
    let n = nombre.value;

    if (validarCandidto(i, n)) {
        let Candidato = {
            id: i,
            nombre: n,
        };

        db.ref("Candidatos").push().set(Candidato);
    } else {
        alert("Ya se encuentre un candidato con este id");
    }
};

let Votar = () => {
    let idv = idvotar.value;

    let voto = {
        idVoto: Math.random(),
        id: idv,
    };

    let key;
    let valide = false;
    db.ref("Candidatos").on("value", function (data) {
        data.forEach(function (c) {
            let valor = c.val();
            let id = valor.id;
            if (id === idv) {
                valide = true;
                key = c.key;
            }
        });
    });
    if (valide) {
        db.ref("Candidatos").child(key).child("votos").push().set(voto);
        db.ref("Votos").push().set(voto);
    } else {
        alert("No hay ningun candidato con este id");
    }
    console.log("elegido");
};

let mostrarCandidatos = () => {
    let arrayNombre = [];
    db.ref("Candidatos").on("value", function (data) {
        console.log(data);
        data.forEach(function (c) {
            let valor = c.val();
            arrayNombre.push(valor.nombre + "  " + valor.id + " ");
            console.log(valor);
        });
    });
    alert(arrayNombre);
};

let mostrarVotos = () => {
    let totalVotos;
    let porcentajeVotos = [];

    db.ref("Votos").on("value", function (data) {
        totalVotos = data.numChildren();
        console.log(totalVotos);
    });

    db.ref("Candidatos").on("value", function (data) {
        data.forEach(function (c) {
            let valor = c.val();
            let key = c.key;
            let name = valor.nombre;

            db.ref("Candidatos")
                .child(key)
                .child("votos")
                .on("value", function (datav) {
                    porcentajeVotos.push(
                        name +
                            " " +
                            (datav.numChildren() / totalVotos) * 100 +
                            " % "
                    );
                });
        });
    });

    alert(porcentajeVotos);
};

votar.addEventListener("click", Votar);
registrar.addEventListener("click", Registrar);
btnCandidato.addEventListener("click", mostrarCandidatos);
btnVotos.addEventListener("click", mostrarVotos);
