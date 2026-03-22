export default function Perfil() {
  return (
    <div className="mt-4">
      <h5><i className="bi bi-code-slash"></i> Tecnologías Dominadas</h5>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span className="small fw-bold">React & Bootstrap</span>
          <span className="small text-muted">85%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span className="small fw-bold">Cloud Computing (Azure/AWS)</span>
          <span className="small text-muted">60%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div className="progress-bar bg-info" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span className="small fw-bold">Arquitectura de Software</span>
          <span className="small text-muted">75%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
        </div>
      </div>

    </div>
  );
}