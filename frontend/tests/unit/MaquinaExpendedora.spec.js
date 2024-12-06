import { shallowMount } from '@vue/test-utils'
import MaquinaExpendedora from '@/components/MaquinaExpendedora.vue';

describe('MaquinaExpendedora.vue - Métodos', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MaquinaExpendedora, {
      data() {
        return {
          cafes: [
            { nombre: 'Café 1', precio: 500, cantidad: 10 },
            { nombre: 'Café 2', precio: 1000, cantidad: 5 },
          ],
          selectedCafes: [0, 0],
          mensajeError: "",
          mensajeExito: "",
          totalPagar: 0,
          pagoBilletes: 0,
          pagoMonedas: {
            "500": 0,
            "100": 0,
            "50": 0,
            "25": 0,
          },
          totalIngresado: 0,
          monedasCambio: {
            "500": 10,
            "100": 10,
            "50": 10,
            "25": 10,
          },
          desgloseVuelto: {},
          vueltoTotal: 0,
          outOfService: false
        }
      }
    })
  })

  describe('increaseQuantity', () => {
    it('aumenta la cantidad seleccionada sin exceder el stock', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [0, 0],
        mensajeError: ""
      });

      // Act
      wrapper.vm.increaseQuantity(0);

      // Assert
      expect(wrapper.vm.selectedCafes[0]).toBe(1);
      expect(wrapper.vm.mensajeError).toBe("");
    });

    it('muestra error si se excede el stock', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [10, 0], // stock del primer café es 10
        mensajeError: ""
      });

      // Act
      wrapper.vm.increaseQuantity(0);

      // Assert
      expect(wrapper.vm.selectedCafes[0]).toBe(10);
      expect(wrapper.vm.mensajeError).toContain("excede el stock disponible");
    });
  });

  describe('decreaseQuantity', () => {
    it('disminuye la cantidad seleccionada si es mayor a 0', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [2, 0],
        mensajeError: ""
      });

      // Act
      wrapper.vm.decreaseQuantity(0);

      // Assert
      expect(wrapper.vm.selectedCafes[0]).toBe(1);
      expect(wrapper.vm.mensajeError).toBe("");
    });

    it('no disminuye por debajo de 0', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [0, 0]
      });

      // Act
      wrapper.vm.decreaseQuantity(0);

      // Assert
      expect(wrapper.vm.selectedCafes[0]).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('calcula el total a pagar correctamente', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [1, 2] // 1 * 500 + 2 * 1000 = 2500
      });

      // Act
      wrapper.vm.calculateTotal();

      // Assert
      expect(wrapper.vm.totalPagar).toBe(2500);
    });
  });

  describe('increaseBilletes & decreaseBilletes', () => {
    it('aumenta la cantidad de billetes', () => {
      // Arrange
      wrapper.setData({ pagoBilletes: 0 });

      // Act
      wrapper.vm.increaseBilletes();

      // Assert
      expect(wrapper.vm.pagoBilletes).toBe(1);
    });

    it('disminuye la cantidad de billetes sin ser negativa', () => {
      // Arrange
      wrapper.setData({ pagoBilletes: 2 });

      // Act
      wrapper.vm.decreaseBilletes();
      wrapper.vm.decreaseBilletes();
      wrapper.vm.decreaseBilletes(); // intento disminuir más allá de 0

      // Assert
      expect(wrapper.vm.pagoBilletes).toBe(0);
    });
  });

  describe('increaseMoneda & decreaseMoneda', () => {
    it('aumenta la cantidad de una denominación de moneda', () => {
      // Arrange
      wrapper.setData({
        pagoMonedas: {
          "500": 0,
          "100": 0,
          "50": 0,
          "25": 0,
        }
      });

      // Act
      wrapper.vm.increaseMoneda("100");

      // Assert
      expect(wrapper.vm.pagoMonedas["100"]).toBe(1);
    });

    it('disminuye la cantidad de una denominación de moneda sin ser negativa', () => {
      // Arrange
      wrapper.setData({
        pagoMonedas: {
          "500": 0,
          "100": 0,
          "50": 2,
          "25": 0,
        }
      });

      // Act
      wrapper.vm.decreaseMoneda("50");
      wrapper.vm.decreaseMoneda("50");
      wrapper.vm.decreaseMoneda("50"); // intento más allá de 0

      // Assert
      expect(wrapper.vm.pagoMonedas["50"]).toBe(0);
    });
  });

  describe('calculateTotalIngresado', () => {
    it('calcula correctamente el total ingresado', () => {
      // Arrange
      wrapper.setData({
        pagoBilletes: 2, // 2 * 1000 = 2000
        pagoMonedas: {
          "500": 1,   // 500
          "100": 2,   // 200
          "50": 1,    // 50
          "25": 0,    // 0
        }
      });

      // Act
      wrapper.vm.calculateTotalIngresado();

      // Assert
      expect(wrapper.vm.totalIngresado).toBe(2750);
    });
  });

  describe('verificarPagoSuficiente', () => {
    it('retorna false si el total ingresado es menor que el total a pagar', () => {
      // Arrange
      wrapper.setData({
        totalPagar: 3000,
        pagoBilletes: 2 // 2000 ingresados
      });

      // Act
      const result = wrapper.vm.verificarPagoSuficiente();

      // Assert
      expect(result).toBe(false);
      expect(wrapper.vm.mensajeError).toContain("El monto ingresado es insuficiente");
    });

    it('retorna true si el total ingresado es mayor o igual al total a pagar', () => {
      // Arrange
      wrapper.setData({
        totalPagar: 3000,
        pagoBilletes: 3 // 3000 ingresados
      });

      // Act
      const result = wrapper.vm.verificarPagoSuficiente();

      // Assert
      expect(result).toBe(true);
      expect(wrapper.vm.mensajeError).toBe("");
    });
  });

  describe('realizarCompra', () => {
    it('muestra error si no hay cafés seleccionados', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [0,0]
      });

      // Act
      wrapper.vm.realizarCompra();

      // Assert
      expect(wrapper.vm.mensajeError).toContain("seleccione al menos un café");
    });

    it('muestra error si el stock es insuficiente', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [11,0] // Excede el stock del café 1
      });

      // Act
      wrapper.vm.realizarCompra();

      // Assert
      expect(wrapper.vm.mensajeError).toContain("excede el stock disponible");
    });

    it('muestra error si el pago es insuficiente', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [1,1]
      });
      wrapper.vm.calculateTotal(); // totalPagar = 1500
      wrapper.setData({
        pagoBilletes: 1 // 1000 ingresados
      });

      // Act
      wrapper.vm.realizarCompra();

      // Assert
      expect(wrapper.vm.mensajeError).toContain("monto ingresado es insuficiente");
    });

    it('procesa la compra correctamente con cambio adecuado', () => {
      // Arrange
      wrapper.setData({
        selectedCafes: [1,1]
      });
      wrapper.vm.calculateTotal(); // totalPagar = 1500
      wrapper.setData({
        pagoBilletes: 2 // 2000 ingresados
      });

      // Act
      wrapper.vm.realizarCompra();

      // Assert
      expect(wrapper.vm.mensajeExito).toContain("Compra realizada exitosamente");
      expect(wrapper.vm.mensajeError).toBe("");
      expect(wrapper.vm.cafes[0].cantidad).toBe(9);
      expect(wrapper.vm.cafes[1].cantidad).toBe(4);
      expect(wrapper.vm.vueltoTotal).toBe(500);
      expect(wrapper.vm.desgloseVuelto["500"]).toBe(1);
    });

    it('muestra error si no hay suficiente cambio', () => {
      // Arrange
      wrapper.setData({
        monedasCambio: {
          "500": 0,
          "100": 0,
          "50": 0,
          "25": 0,
        },
        selectedCafes: [1]
      });
      wrapper.vm.calculateTotal(); // totalPagar = 500
      wrapper.setData({
        pagoBilletes: 1 // 1000 ingresados
      });

      // Act
      wrapper.vm.realizarCompra();

      // Assert
      expect(wrapper.vm.mensajeError).toContain("No hay suficiente cambio");
      expect(wrapper.vm.outOfService).toBe(true);
    });
  });
});
