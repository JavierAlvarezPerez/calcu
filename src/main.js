import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

let historial = [];

// 🔹 Analizar expresión
function analizarExpresion(expresion) {
  const tokens = expresion.trim().split(" ");
  if (tokens.length < 3) {
    throw new Error("Formato incorrecto. Usa algo como: 2 + 2 / 5");
  }

  let pasosTriplos = [];
  let pasosCuadruplos = [];

  if (tokens.includes("/") || tokens.includes("*")) {
    const [a, op1, b, op2, c] = tokens;
    const primero = (op2 === "/" || op2 === "*") ? op2 : op1;

    if (primero === op2) {
      pasosTriplos = [
        `t1 = ${b} ${op2} ${c}`,
        `t2 = ${a} ${op1} t1`,
        `r = t2`
      ];
      pasosCuadruplos = [
        { op: op2, arg1: b, arg2: c, res: "t1" },
        { op: op1, arg1: a, arg2: "t1", res: "t2" },
        { op: "=", arg1: "t2", arg2: "", res: "r" }
      ];
    } else {
      pasosTriplos = [
        `t1 = ${a} ${op1} ${b}`,
        `t2 = t1 ${op2} ${c}`,
        `r = t2`
      ];
      pasosCuadruplos = [
        { op: op1, arg1: a, arg2: b, res: "t1" },
        { op: op2, arg1: "t1", arg2: c, res: "t2" },
        { op: "=", arg1: "t2", arg2: "", res: "r" }
      ];
    }
  } else {
    const [a, op, b] = tokens;
    pasosTriplos = [
      `t1 = ${a} ${op} ${b}`,
      `r = t1`
    ];
    pasosCuadruplos = [
      { op: op, arg1: a, arg2: b, res: "t1" },
      { op: "=", arg1: "t1", arg2: "", res: "r" }
    ];
  }

  return { pasosTriplos, pasosCuadruplos };
}

// 🔹 Mostrar historial
function actualizarHistorial() {
  const divHistorial = document.getElementById("historial");
  if (historial.length === 0) {
    divHistorial.innerHTML = "<p>No hay operaciones previas.</p>";
    return;
  }

  divHistorial.innerHTML = historial.map((item, i) => `
    <div class="itemHistorial">
      <h4>Operación ${i + 1}: ${item.expresion}</h4>
      ${item.html}
    </div>
  `).join("");
}

// 🔹 Generar operación
document.getElementById("btnGenerar").addEventListener("click", () => {
  const expresion = document.getElementById("expresion").value.trim();
  const tipo = document.getElementById("tipoOperacion").value;
  const salida = document.getElementById("salida");
  const resultado = document.getElementById("resultado");

  if (!expresion) {
    resultado.textContent = "Por favor ingresa una expresión.";
    salida.innerHTML = "";
    return;
  }

  try {
    const { pasosTriplos, pasosCuadruplos } = analizarExpresion(expresion);
    let htmlSalida = "";

    if (tipo === "triplos" || tipo === "ambos") {
      htmlSalida += `
        <h3>Triplos</h3>
        <div class="bloque">
          ${pasosTriplos.map(p => `<p>${p}</p>`).join("")}
        </div>
      `;
    }

    if (tipo === "cuadruplos" || tipo === "ambos") {
      htmlSalida += `
        <h3>Cuádruplos</h3>
        <table class="table table-striped">
          <thead>
            <tr><th>Operador</th><th>Arg1</th><th>Arg2</th><th>Resultado</th></tr>
          </thead>
          <tbody>
            ${pasosCuadruplos.map(c =>
              `<tr><td>${c.op}</td><td>${c.arg1}</td><td>${c.arg2}</td><td>${c.res}</td></tr>`
            ).join("")}
          </tbody>
        </table>
      `;
    }

    resultado.textContent = "Resultado generado correctamente.";
    salida.innerHTML = htmlSalida;

    // Guardar en historial
    historial.unshift({ expresion, html: htmlSalida });
    actualizarHistorial();

  } catch (error) {
    resultado.textContent = error.message;
    salida.innerHTML = "";
  }
});

// 🔹 Limpiar historial
document.getElementById("btnLimpiarHistorial").addEventListener("click", () => {
  if (confirm("¿Seguro que deseas borrar todo el historial?")) {
    historial = [];
    actualizarHistorial();
  }
});

// 🔹 Limpiar formulario
document.getElementById("btnLimpiarFormulario").addEventListener("click", () => {
  document.getElementById("expresion").value = "";
  document.getElementById("resultado").textContent = "";
  document.getElementById("salida").innerHTML = "";
});
