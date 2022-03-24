import React from "react";
import styled from "styled-components";
import { IoIosClose } from "react-icons/io";

const Modal = ({ children, estado, cambiarEstado, titulo = 'Titulo', mostrarHeader }) => {
    return (
        <>
            {estado &&
                <Overlay>
                    <ContenedorModal>
                        {mostrarHeader &&
                            <EncabezadoModal>
                                <h3>{titulo}</h3>
                            </EncabezadoModal>
                        }

                        <BotonCerrar onClick={() => cambiarEstado(false)}>
                            <IoIosClose />
                        </BotonCerrar>

                        {children}
                    </ContenedorModal>

                </Overlay>
            }
        </>
    );

}

export default Modal;

const Overlay = styled.div`
width: 100vw;
height: calc(100vh - 0px);
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    padding: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContenedorModal = styled.div`
width: 500px;
min-height: 100px;
background: #fff;
position: relative;
border-radius: 5px;
box-shadow: rgba(100,100,111, 0.2) 0px 7px 29px 0px;
padding:20px;
    `;

const EncabezadoModal = styled.div`
    display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid #E8E8E8;
	h3 {
		font-weight: 500;
		font-size: 16px;
		color: #1766DC;
	}
    `;
const BotonCerrar = styled.button`
    position: absolute;
    top: 15px;
    right: 20px;
    width: 30px;
    height: 30px;
    border:none;
    background: none;
    cursor: pointer;
    transition: .3s ease all;
    border-radius: 5px;
    color: #1766DC;

    &:hover{
        background: #f2f2f2;
    }

    IoIosClose{
    width: 100%;
    height: 100%;
    }
    `;