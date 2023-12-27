import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const Student = () => {
  // state for create student modal
  const [modal, setModal] = useState(false);
  // state for edit student modal
  const [editModal, setEditModal] = useState(false);
  // state for single student modal
  const [singleModal, setsingleModal] = useState(false);
  // state for all students data
  const [student, setStudent] = useState([]);

  // show modal
  const handleModalShow = () => {
    setModal(true);
  };

  // hide modal
  const handleModalHide = () => {
    setModal(false);
  };

  // show edit modal
  const handleEditModalShow = () => {
    setEditModal(true);
  };
  // hide edit modal
  const handleEditModalHide = () => {
    setEditModal(false);

    // clear form
    setInput({
      name: "",
      age: "",
      roll: "",
      photo: "",
    });
  };

  /**
   * show single modal
   * @param {*} id
   */
  const handlesingleModalShow = (id) => {
    setsingleModal(true);

    // set student data to the input state
    setInput(student.find((data) => data.id === id));
  };
  // hide single modal
  const handlesingleModalHide = () => {
    setsingleModal(false);

    // clear form
    setInput({
      name: "",
      age: "",
      roll: "",
      photo: "",
    });
  };

  // student form management
  const [input, setInput] = useState({
    name: "",
    age: "",
    roll: "",
    photo: "",
  });

  //  handle Input Change
  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * handle CreateStudent
   * @param {*} e
   */
  const handleCreateStudetn = async (e) => {
    e.preventDefault();

    // validation
    if (!input.name || !input.age || !input.roll || !input.photo) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
    } else {
      await axios.post("http://localhost:7070/students", input);

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Student created successful",
        showConfirmButton: false,
        timer: 1500,
      });

      // clear form
      setInput({
        name: "",
        age: "",
        roll: "",
        photo: "",
      });

      // close modal
      handleModalHide();
      // call getAllStudent
      getAllStudetn();
    }
  };

  /**
   * handle get all student
   * @param {*} e
   */
  const getAllStudetn = async () => {
    const response = await axios.get("http://localhost:7070/students");

    // set all students data to the "student" state
    setStudent(response.data);
  };

  /**
   * handle delete student
   * @param {*} e
   */
  const handleDeleteStudent = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // delete
        axios.delete(`http://localhost:7070/students/${id}`);

        // get all student
        getAllStudetn();

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });

    getAllStudetn();
  };

  /**
   *  handle Edit Modal
   * @param {*} e
   */
  const handleEditModal = (id) => {
    // show edit modal
    handleEditModalShow();

    // set student data to the input state
    setInput(student.find((data) => data.id === id));
  };

  /**
   *  handle Update Student
   * @param {*} e
   */
  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    // validation
    if (!input.name || !input.age || !input.roll || !input.photo) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
    } else {
      await axios.patch(`http://localhost:7070/students/${input.id}`, input);

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Student updated successful",
        showConfirmButton: false,
        timer: 1500,
      });

      // clear form
      setInput({
        name: "",
        age: "",
        roll: "",
        photo: "",
      });

      // close modal
      handleEditModalHide();
      // call getAllStudent
      getAllStudetn();
    }
  };

  // call getAllStudetn function to load all students data
  useEffect(() => {
    getAllStudetn();
  }, []);

  return (
    <>
      <Container>
        <Row className="justify-content-center py-5">
          <Col md={8}>
            <Card className="shadow">
              <Card.Body>
                <Button onClick={handleModalShow}>Create a student</Button>
                <br />
                <br />
                {/* students table starts */}
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Roll</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.map((item, index) => {
                      return (
                        <tr className="align-middle" key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              style={{
                                height: "70px",
                                width: "70px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              src={item.photo}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.age}</td>
                          <td>{item.roll}</td>
                          <td>
                            <Button
                              variant="info"
                              className="btn-sm me-2"
                              onClick={() => handlesingleModalShow(item.id)}
                            >
                              <GoEye />
                            </Button>
                            <Button
                              variant="warning"
                              className="btn-sm me-2"
                              onClick={() => handleEditModal(item.id)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              className="btn-sm"
                              onClick={() => handleDeleteStudent(item.id)}
                            >
                              <MdDelete />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {/* students table starts */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* create student modal  starts*/}
      <Modal show={modal} onHide={handleModalHide} centered>
        <Modal.Header>
          <Modal.Title>Create a student</Modal.Title>
          <Button className="btn-close" onClick={handleModalHide}></Button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateStudetn}>
            <div className="py-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                name="name"
                value={input.name}
                onChange={handleInputChange}
                id=""
                className="form-control"
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Age</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="age"
                value={input.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Roll</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="roll"
                value={input.roll}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Photo URL</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="photo"
                value={input.photo}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit"> Create</Button>
          </form>
        </Modal.Body>
      </Modal>
      {/* create student modal ends */}

      {/*  edit student modal  starts*/}
      <Modal show={editModal} onHide={handleEditModalHide} centered>
        <Modal.Header>
          <Modal.Title>Create a student</Modal.Title>
          <Button className="btn-close" onClick={handleEditModalHide}></Button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateStudent}>
            <div className="py-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="name"
                value={input.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Age</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="age"
                value={input.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Roll</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="roll"
                value={input.roll}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-2">
              <label htmlFor="">Photo URL</label>
              <input
                type="text"
                id=""
                className="form-control"
                name="photo"
                value={input.photo}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit"> Save</Button>
          </form>
        </Modal.Body>
      </Modal>
      {/*  edit student modal ends */}

      {/*  show single student modal  starts*/}
      <Modal show={singleModal} onHide={handlesingleModalHide} centered>
        <Modal.Header>
          <Modal.Title>Single student</Modal.Title>
          <Button
            className="btn-close"
            onClick={handlesingleModalHide}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  borderRadius: "50%",
                  display: "block",
                  margin: "auto",
                }}
                src={input.photo}
                alt=""
              />
              <br />
              <div
                className="content-wrapper"
                style={{ width: "60%", margin: "auto" }}
              >
                <h4 className="d-flex justify-content-between">
                  Name: <span>{input.name}</span>
                </h4>
                <h5 className="d-flex justify-content-between">
                  Age: <span>{input.age}</span>
                </h5>
                <h6 className="d-flex justify-content-between">
                  Roll: <span>{input.roll}</span>
                </h6>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
      {/*  show single student modal  ends */}
    </>
  );
};

export default Student;
