import React, {useState, useEffect } from "react";
import { NavLink} from "react-router-dom";
import styled from "styled-components";


import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import scrollreveal from "scrollreveal";

export default function SidebarAD(props) {
  const [currentLink, setCurrentLink] = useState(1);
  const [navbarState, setNavbarState] = useState(false);
  const html = document.querySelector("html");
  html.addEventListener("click", () => setNavbarState(false));

  useEffect(() => {
    const sr = scrollreveal({
      origin: "left",
      distance: "80px",
      duration: 1000,
      reset: false,
    });

    return()=>{ sr.reveal(
      `
      .links>ul>li:nth-of-type(1),
      .links>ul>li:nth-of-type(2),
      .links>ul>li:nth-of-type(3),
     
      `,
      {
        opacity: 0,
        interval: 300,
      }
    );}

  }, []);

  return (
    <>
      <Section>
        <div className="top">
          
        <div className="toggle">
            {navbarState ? (
              <VscChromeClose onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu
                onClick={(e) => {
                  e.stopPropagation();
                  setNavbarState(true);
                }}
              />
            )}
          </div>

          <div className="links">
            <ul>
              <li
                className={currentLink === 1 ? "active" : "none"}
                onClick={() => setCurrentLink(1)}
              >
                <NavLink to={props.PrimerR} exact activeClassName="active" >
                 {props.iconoP}
                  <span> {props.PrimerT}</span>
                </NavLink>
              </li>
              <li
                className={currentLink === 2 ? "active" : "none"}
                onClick={() => setCurrentLink(2)}
              >
                <NavLink to={props.DosR} exact activeClassName="active">
                  {props.iconoS}
                  <span> {props.DosT}</span>
                </NavLink>
              </li>
              <li
                className={currentLink === 3 ? "active" : "none"}
                onClick={() => setCurrentLink(3)}
              >
                <NavLink to={props.TresR} exact activeClassName="active">
                  {props.iconoT}
                  <span> {props.TresT}</span>
                </NavLink>
              </li>
              {/**Agregue esta partea al sidebar */}
             
            </ul>
          </div>
        </div>
      </Section>

      <ResponsiveNav state={navbarState} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
          <li
                className={currentLink === 1 ? "active" : "none"}
                onClick={() => setCurrentLink(1)}
              >
                <NavLink to={props.PrimerR} exact activeClassName="active" >
                 {props.iconoP}
                  <span> {props.PrimerT}</span>
                </NavLink>
              </li>
              <li
                className={currentLink === 2 ? "active" : "none"}
                onClick={() => setCurrentLink(2)}
              >
                <NavLink to={props.DosR} exact activeClassName="active">
                  {props.iconoT}
                  <span> {props.DosT}</span>
                </NavLink>
              </li>
              <li
                className={currentLink === 3 ? "active" : "none"}
                onClick={() => setCurrentLink(3)}
              >
                <NavLink to={props.TresR} exact activeClassName="active">
                  {props.iconoT}
                  <span> {props.TresT}</span>
                </NavLink>
              </li>
             
            
            
          </ul>
        </div>
      </ResponsiveNav>
    </>
  );
}
const Section = styled.section`
  position: absolute;
  left: 0;
  top : 0px;
  background-color: #009480;
  height: 100vh;
  max-width: 18vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
  
  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    height: 100%;

    .toggle {
      display: none;
    }
    .links {
      display: flex;
      justify-content: center;
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        li {
          padding: 0.6rem 1rem;
          border-radius: 0.6rem;
          &:hover {
            background-color: #00b9bc;
            a {
              color: black;
            }
          }
          a {
            text-decoration: none;
            display: flex;
            gap: 1rem;
            color: white;
          }
        }
        .active {
          background-color: #00b9bc;
          a {
            color: black;
          }
        }
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    position: initial;
    width: 100%;
    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      .toggle {
        display: block;
        color: white;
        z-index: 99;
        svg {
          font-size: 1.4rem;
        }
      }
      .brand {
        gap: 1rem;
        justify-content: flex-start;
      }
    }
    .top > .links {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  position: fixed;
  right: -10vw;
  top: 0;
  z-index: 10;
  background-color: #009480;
  height: 100vh;
  width: ${({ state }) => (state ? "40%" : "0%")};
  transition: 0.4s ease-in-out;
  display: flex;
  opacity: 0;
  visibility: hidden;
  padding: 0rem;
  .responsive__links {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;
      li {
        padding: 0.6rem 1rem;
        border-radius: 0.6rem;
        &:hover {
          background-color: #00b9bc;
            a {
              color: black;
            }
        }
        
        a {
          text-decoration: none;
          display: flex;
          gap: 1rem;
          color: white;
        }
      }
      .active {
        background-color: #00b9bc;
          a {
            color: black;
          }
      }
    }
  }
`;
