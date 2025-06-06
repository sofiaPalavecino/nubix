import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import Goal from "../Goal/Goal"
import GoalsOverallProgressCard from "../GoalsOverallProgressCard/GoalsOverallProgressCard";
import './Achievements.scss'
import { fetchGoals } from "../../services/api";
import { IGoals } from "../../interfaces/IGoals";
import { useLocation } from "react-router-dom";
import mockGoals from "../../components/__mocks__/mockGoals";

type GoalsStats = {
    completedGoals: number,
    completionPercentage: number,
    totalGoals: number
}

function analyzeGoals(goals:IGoals[]) {
    const totalGoals = goals.length;
    const completedGoals = /* goals.filter(goal => goal.progress >= goal.goal).length */ 0;
    const completionPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
        completedGoals,
        completionPercentage: Math.round(completionPercentage),
        totalGoals
    };
}

const goalsStats: GoalsStats = analyzeGoals(mockGoals)

export default function Achievements() {

    const [, setShow] = useState(false);
    const [groupGoals, setGroupGoals] = useState<IGoals[]>([]);
    const [, setLoading] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const groupTitle = searchParams.get("group");
    const isGroup = Boolean(groupTitle);

    useEffect(() => {
        if (isGroup) {
            setLoading(true);
            fetchGoals(3)
                .then((data) => setGroupGoals(data))
                .finally(() => setLoading(false));
        }
    }, [isGroup]);

    const goals = isGroup && groupGoals.length > 0 ? groupGoals : mockGoals;
    
    /* const handleClose = () => setShow(false); */
    const handleShow = () => setShow(true);

    /* const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Expense Submitted");
    }; */

    return (
        <div className="c-achievements container mt-3">
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Nuevo objetivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="p-3">
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                            type="textarea"
                            name="name"
                            placeholder="Ingresa un nombre"
                            value={formData.title}
                            onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="goal" className="mb-3">
                            <Form.Label>Objetivo $$</Form.Label>
                            <Form.Control
                            type="number"
                            name="goal"
                            placeholder="0.00"
                            value={formData.targetAmount}
                            onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="category" className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select name="category" value={formData.category_id} onChange={handleChange}>
                                <option value="" selected disabled>Seleccionar categoria</option>
                                <option value="food">Comida</option>
                                <option value="transport">Transporte</option>
                                <option value="entertainment">Cultura</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit" variant="dark" className="w-100 d-flex align-items-center justify-content-center gap-2 buttonPrimary">
                            <BsPlus size={20} />
                            Agregar objetivo
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal> */}
          <div className="d-flex align-items-center">
             <h2 className="mb-0">Objetivos</h2>
            <span className="badge bg-secondary ms-2">Próximamente</span>
            </div>
            
            <p className="text-muted subtitle">Hacé un seguimiento de tus objetivos</p>
            <div className="row my-4">
               
                <div className="col ">
                    <Card className="addObj">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Button 
                                variant="secondary"
                                className="d-flex align-items-center rounded-circle shadow mb-4 buttonPrimary"
                                style={{ width: "45px", height: "45px" }}
                                onClick={handleShow}
                            ><BsPlusLg size={30} />
                            </Button>
                            <h5 className="card-title mt-2">Creá un nuevo objetivo</h5>
                            <p className="text-muted">Creá un nuevo objetivo financiero para darle seguimiento</p>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col">
                    <GoalsOverallProgressCard {...goalsStats} />
                </div>
            </div>
            <div className="goals-container">
                { goals.map((goal, index) => (
                    <Goal progress={0} key={index} {...goal}></Goal>
                ))}
            </div>
        </div>
    )
}