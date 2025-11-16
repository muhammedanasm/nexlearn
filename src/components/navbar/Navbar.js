"use client";
import React from "react";
import Button from "../button/Button";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./navbar.css";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // clear all relevant storage
        localStorage.clear();
        sessionStorage.clear();

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    });
  };
  return (
    <div>
      <div className="Navbar">
        <div className="empty"></div>
        <img src="./images/OBJECTS.svg" />
        <Button text={"Logout"} className="logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;
