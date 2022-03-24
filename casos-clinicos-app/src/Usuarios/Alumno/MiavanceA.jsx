//interfaz para visualizr el avance del alumno
import React, {useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";

export default function  MiavanceA() {
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
        <div class=" border bg-light px-4">
                        <form claseName="" method="POST" action="">
                            <fieldset>
                                <br></br>

                                <h1>Resultados de uso</h1>

                                <div class="form-group">
                                    <label for="InputMatricula">Temas completados</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="InputMatricula">Cuestionarios completados</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="InputMatricula">Promedio general</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                            </fieldset>
                            <br />
                            <br />
                        </form>
                    </div>
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
