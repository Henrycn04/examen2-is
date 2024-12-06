<template>
  <div class="container mt-5">
    <div class="text-center mb-4">
      <h1 class="mt-2 text-brown">Máquina Expendedora de Café</h1>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card mb-3 shadow-sm">
          <div class="card-body p-2">
            <h3 class="card-title text-brown">Cafés Disponibles</h3>
            <div class="row">
              <div
                class="col-lg-2 col-md-3 col-sm-4 col-6 mb-2"
                v-for="(cafe, index) in cafes"
                :key="index"
              >
                <div class="card h-100 text-center border-0">
                  <div class="card-body p-2">
                    <i
                      :class="cafe.icono"
                      class="coffee-icon mb-2"
                    ></i>
                    <h5 class="card-title" style="font-size: 1rem;">
                      {{ cafe.nombre }}
                    </h5>
                    <p class="card-text mb-1" style="font-size: 0.9rem;">
                      Precio: {{ cafe.precio }} colones
                    </p>
                    <p class="card-text mb-2" style="font-size: 0.9rem;">
                      Disponible: {{ cafe.cantidad }}
                    </p>
                    <div class="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        class="btn btn-brown"
                        @click="decreaseQuantity(index)"
                      >
                        -
                      </button>
                      <button type="button" class="btn btn-light" disabled>
                        {{ selectedCafes[index] }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-brown"
                        @click="increaseQuantity(index)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <h5>
                Total a pagar: <strong>{{ totalPagar }} colones</strong>
              </h5>
            </div>
          </div>
        </div>

        <div class="card mb-3 shadow-sm">
          <div class="card-body p-2">
            <h4 class="text-brown">Ingrese su Pago</h4>
            <div class="row">
              <div class="col-sm-6 mb-2">
                <label class="font-weight-bold"
                  >Billetes de 1000 colones:</label
                >
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <button
                      class="btn btn-brown"
                      type="button"
                      @click="decreaseBilletes"
                    >
                      -
                    </button>
                  </div>
                  <input
                    type="text"
                    class="form-control text-center"
                    :value="pagoBilletes"
                    readonly
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-brown"
                      type="button"
                      @click="increaseBilletes"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-sm-6">
                <label class="font-weight-bold">Monedas:</label>
                <div
                  v-for="denom in ['500', '100', '50', '25']"
                  :key="denom"
                  class="mb-1"
                >
                  <label style="font-size: 0.9rem;">{{ denom }} colones:</label>
                  <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                      <button
                        class="btn btn-brown"
                        type="button"
                        @click="decreaseMoneda(denom)"
                      >
                        -
                      </button>
                    </div>
                    <input
                      type="text"
                      class="form-control text-center"
                      :value="pagoMonedas[denom]"
                      readonly
                    />
                    <div class="input-group-append">
                      <button
                        class="btn btn-brown"
                        type="button"
                        @click="increaseMoneda(denom)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <h5>
                Total ingresado: <strong>{{ totalIngresado }} colones</strong>
              </h5>
            </div>
            <button
              class="btn btn-brown btn-block btn-sm mt-2"
              @click="realizarCompra"
              :disabled="outOfService"
            >
              Realizar Compra
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <div v-if="mensajeError" class="alert alert-danger mb-2">
              {{ mensajeError }}
            </div>
            <div v-if="mensajeExito" class="alert alert-success mb-2">
              {{ mensajeExito }}
              <div v-if="vueltoTotal > 0">
                <p style="font-size: 0.9rem;">
                  Su vuelto es de {{ vueltoTotal }} colones.
                </p>
                <p style="font-size: 0.9rem;">Desglose:</p>
                <ul style="font-size: 0.9rem; padding-left: 20px;">
                  <li
                    v-for="(cantidad, moneda) in desgloseVuelto"
                    :key="moneda"
                  >
                    {{ cantidad }} moneda(s) de {{ moneda }} colones
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="outOfService" class="alert alert-danger mt-2 mb-0">
              Fuera de servicio
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "MaquinaCafe",
  data() {
    return {
      cafes: [
        {
          nombre: "Americano",
          precio: 950,
          cantidad: 10,
          icono: "fas fa-mug-hot",
        },
        {
          nombre: "Capuchino",
          precio: 1200,
          cantidad: 8,
          icono: "fas fa-coffee",
        },
        {
          nombre: "Latte",
          precio: 1350,
          cantidad: 10,
          icono: "fas fa-mug-hot",
        },
        {
          nombre: "Mocachino",
          precio: 1500,
          cantidad: 1,
          icono: "fas fa-coffee",
        },
      ],
      selectedCafes: [0, 0, 0, 0],
      totalPagar: 0,
      pagoBilletes: 0,
      pagoMonedas: {
        "500": 0,
        "100": 0,
        "50": 0,
        "25": 0,
      },
      monedasCambio: {
        "500": 1,
        "100": 20,
        "50": 20,
        "25": 20,
      },
      mensajeError: "",
      mensajeExito: "",
      vueltoTotal: 0,
      desgloseVuelto: {},
      outOfService: false,
      totalIngresado: 0,
    };
  },
  methods: {
    increaseQuantity(index) {
      if (this.selectedCafes[index] < this.cafes[index].cantidad) {
        this.selectedCafes[index]++;
        this.calculateTotal();
        this.mensajeError = "";
      } else {
        this.mensajeError =
          "La cantidad solicitada de " +
          this.cafes[index].nombre +
          " excede el stock disponible.";
      }
    },
    decreaseQuantity(index) {
      if (this.selectedCafes[index] > 0) {
        this.selectedCafes[index]--;
        this.calculateTotal();
        this.mensajeError = "";
      }
    },
    calculateTotal() {
      this.totalPagar = this.selectedCafes.reduce(
        (total, cantidad, index) => total + cantidad * this.cafes[index].precio,
        0
      );
    },
    increaseBilletes() {
      this.pagoBilletes++;
      this.calculateTotalIngresado();
    },
    decreaseBilletes() {
      if (this.pagoBilletes > 0) {
        this.pagoBilletes--;
        this.calculateTotalIngresado();
      }
    },
    increaseMoneda(denominacion) {
      this.pagoMonedas[denominacion]++;
      this.calculateTotalIngresado();
    },
    decreaseMoneda(denominacion) {
      if (this.pagoMonedas[denominacion] > 0) {
        this.pagoMonedas[denominacion]--;
        this.calculateTotalIngresado();
      }
    },
    calculateTotalIngresado() {
      const billetes = this.pagoBilletes * 1000;
      const monedas = Object.keys(this.pagoMonedas).reduce(
        (total, denom) => total + this.pagoMonedas[denom] * parseInt(denom),
        0
      );
      this.totalIngresado = billetes + monedas;
    },
    realizarCompra() {
      this.limpiarVariables();
      if (!this.hayCafesSeleccionados()) {
        return;
      }
      if (!this.verificarStock()) {
        return;
      }
      if (!this.verificarPagoSuficiente()) {
        return;
      }
      this.procesarCompra();
    },
    limpiarVariables() {
      this.mensajeError = "";
      this.mensajeExito = "";
      this.desgloseVuelto = {};
      this.vueltoTotal = 0;
    },
    hayCafesSeleccionados() {
      const totalCafesSeleccionados = this.selectedCafes.reduce((a, b) => a + b, 0);
      if (totalCafesSeleccionados === 0) {
        this.mensajeError = "Por favor, seleccione al menos un café.";
        return false;
      }
      return true;
    },
    verificarStock() {
      for (let i = 0; i < this.selectedCafes.length; i++) {
        if (this.selectedCafes[i] > this.cafes[i].cantidad) {
          this.mensajeError = `La cantidad solicitada de ${this.cafes[i].nombre} excede el stock disponible.`;
          return false;
        }
      }
      return true;
    },
    verificarPagoSuficiente() {
      this.calculateTotalIngresado();
      if (this.totalIngresado < this.totalIngresado) {
        this.mensajeError = "El monto ingresado es insuficiente para realizar la compra.";
        return false;
      }
      return true;
    },
    procesarCompra() {
      const totalPagado =
        this.pagoBilletes * 1000 +
        this.pagoMonedas["500"] * 500 +
        this.pagoMonedas["100"] * 100 +
        this.pagoMonedas["50"] * 50 +
        this.pagoMonedas["25"] * 25;
      let cambio = totalPagado - this.totalPagar;
      const cambioOriginal = cambio;

      let monedasDisponibles = { ...this.monedasCambio };
      let desglose = {};

      const denominaciones = [500, 100, 50, 25];

      for (let denom of denominaciones) {
        let cantidadMonedas = Math.floor(cambio / denom);
        if (cantidadMonedas > 0) {
          if (monedasDisponibles[denom] >= cantidadMonedas) {
            desglose[denom] = cantidadMonedas;
            monedasDisponibles[denom] -= cantidadMonedas;
            cambio -= denom * cantidadMonedas;
          } else if (monedasDisponibles[denom] > 0) {
            desglose[denom] = monedasDisponibles[denom];
            cambio -= denom * monedasDisponibles[denom];
            monedasDisponibles[denom] = 0;
          }
        }
      }
      if (cambio > 0) {
        this.mensajeError = "Fallo al realizar la compra. No hay suficiente cambio.";
        this.checkOutOfService();
        return;
      }
      this.actualizarStockCafes();
      this.actualizarMonedasCambio(monedasDisponibles);
      this.establecerMensajeExito(cambioOriginal, desglose);
      this.reiniciarCampos();
    },
    actualizarStockCafes() {
      for (let i = 0; i < this.selectedCafes.length; i++) {
        this.cafes[i].cantidad -= this.selectedCafes[i];
      }
    },
    actualizarMonedasCambio(monedasDisponibles) {
      console.log("Antes", this.monedasCambio);
      this.monedasCambio = { ...monedasDisponibles };

      this.monedasCambio["500"] += this.pagoMonedas["500"];
      this.monedasCambio["100"] += this.pagoMonedas["100"];
      this.monedasCambio["50"] += this.pagoMonedas["50"];
      this.monedasCambio["25"] += this.pagoMonedas["25"];
      console.log("Despues", this.monedasCambio);
    },
    establecerMensajeExito(cambio, desglose) {
      this.mensajeExito = "Compra realizada exitosamente.";

      if (cambio > 0) {
        this.vueltoTotal = cambio;
        this.desgloseVuelto = desglose;
      }
    },
    reiniciarCampos() {
      this.selectedCafes = this.selectedCafes.map(() => 0);
      this.calculateTotal();
      this.pagoBilletes = 0;
      this.pagoMonedas = {
        "500": 0,
        "100": 0,
        "50": 0,
        "25": 0,
      };
      this.checkOutOfService();
      this.totalIngresado = 0;
    },
    checkOutOfService() {
      const totalMonedas =
        this.monedasCambio["500"] +
        this.monedasCambio["100"] +
        this.monedasCambio["50"] +
        this.monedasCambio["25"];
      if (totalMonedas === 0) {
        this.outOfService = true;
      } else {
        this.outOfService = false;
      }
    },
  },
  mounted() {
    this.checkOutOfService();
  },
};
</script>


<style scoped>

.text-brown {
  color: #6F4E37;
}
.btn-brown {
  background-color: #6F4E37;
  color: white;
}
.btn-brown:hover {
  background-color: #5A3C2D;
}
</style>
