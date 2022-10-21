//interfaz para visualizr el avance del alumno
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { FcList } from "react-icons/fc";
import { FcRatings } from "react-icons/fc";
import { FcTimeline } from "react-icons/fc";
import { FcButtingIn } from "react-icons/fc";
import ProgressBar from "react-bootstrap/ProgressBar";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";

export default function MiavanceA({ user }) {
  const [alumno, setAlumno] = useState(null);
  const [temasNum, settemasNum] = useState(0);
  const [cuesNum, setCuesNum] = useState(0);
  const [nrc, setNrc] = useState(0);
  const [barra, setBarra] = useState(0);

  const db = getFirestore(firebaseApp);

  async function getTemas() {
    var numTemas = 0;
    const q = query(collection(db, "Temas"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      numTemas++;
    });
    return numTemas;
  }
  async function getCuestionarios() {
    const docRef = doc(db, "Alumno", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const nrcAl = docSnap.data().NRC;
      console.log("NRC", nrcAl);
      var numCuestionarios = 0;
      const q = query(
        collection(db, "Cuestionarios"),
        where("nrcClase", "array-contains", nrcAl)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        numCuestionarios++;
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    return numCuestionarios;
  }

  useEffect(() => {
    getTemas().then((res) => {
      console.log("Num de temas totales", res);
      settemasNum(res);
    });

    getCuestionarios().then((res) => {
      console.log("Num de cuestionarios totales", res);
      setCuesNum(res);
    });

    const docRef = doc(db, `Alumno/${user.uid}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      const alumnoData = doc.data();
      setAlumno(alumnoData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
          nav,
          .row__one,
          .row__two
      `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);
  return (
    <Section>
      {alumno ? (
        <div class="row border bg-light px-4">
          <h1>Resultados de uso</h1>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <h1>
                        {" "}
                        <FcButtingIn />
                      </h1>
                    </div>
                    <div className="media-body text-right">
                      <h3>
                        {alumno.Nombre} {alumno.ApellidoPaterno}{" "}
                        {alumno.ApellidoMaterno}
                      </h3>
                      <span>Estudiante</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <h1>
                        <FcList />
                      </h1>
                    </div>
                    <div className="media-body text-right">
                      <h3>Temas completos</h3>
                      <ProgressBar
                        animated
                        now={(alumno.Avance.TemasCompletos * 100) / temasNum}
                      />
                      <span>
                        {alumno.Avance.TemasCompletos} / {temasNum}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 p-2">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <h1>
                        <FcTimeline />
                      </h1>
                    </div>
                    <div className="media-body text-right">
                      <h3>Cuestionarios completos</h3>
                      <ProgressBar
                        animated
                        now={
                          (alumno.Avance.CuestionariosCompletos * 100) / cuesNum
                        }
                      />
                      <span>
                        {alumno.Avance.CuestionariosCompletos} / {cuesNum}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 p-2">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <h1>
                        {" "}
                        <FcRatings />
                      </h1>
                    </div>
                    <div className="media-body text-right">
                      <h3>Promedio general</h3>
                      <span>{alumno.Avance.PromedioGeneral} / 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
const Section = styled.section`
  margin-left: 18vw;
  padding: 2rem;
  height: 100%;
  .grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    margin-top: 2rem;
    .row__one {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      height: 50%;
      gap: 1rem;
    }
    .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      height: 50%;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;
