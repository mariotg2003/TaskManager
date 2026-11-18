import { useEffect, useRef, useState } from "react";

export default function MonthDialog({ mes, onGuardar, onCerrar }) {
  const ref = useRef(null);
  const [valor, setValor] = useState(mes);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  const enviar = (e) => {
    e.preventDefault();
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(valor)) {
      setError("Formato de mes no válido");
      return;
    }
    onGuardar(valor);
  };

  return (
    <dialog ref={ref} onClose={onCerrar} aria-labelledby="titulo-mes">
      <form onSubmit={enviar}>
        <h3 id="titulo-mes">Crear mes</h3>
        <label>
          Mes (AAAA-MM)
          <input
            type="text"
            autoFocus
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="2025-11"
          />
        </label>
        {error && <span role="alert">{error}</span>}
        <div className="dialogo-acciones">
          <button type="button" className="btn" onClick={() => ref.current.close()}>
            Cancelar
          </button>
          <button type="submit" className="btn primario">
            Crear
          </button>
        </div>
      </form>
    </dialog>
  );
}
