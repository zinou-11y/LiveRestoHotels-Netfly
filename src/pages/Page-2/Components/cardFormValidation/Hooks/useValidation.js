import * as yup from "yup";
import { fr } from "yup-locales";
import { setLocale } from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

setLocale(fr);

const schema = yup
  .object({
    fullName: yup.string().email().required(),
    voucher_code: yup.number().min(5).required(),
    phone: yup.number().min(10).required(),
    apartement: yup.string().min(10).required(),
  })
  .required();

export function useValidation(
  Hotel,
  orderState,
  billaddress,
  Products,
  Payments
) {
  const [hotel, setValues] = useState(Hotel);
  const [order, setOrder] = useState(orderState);
  const [bill, setbillEmail] = useState("");
  const [code, setCode] = useState(false);

  const [products, setProducts] = useState(Products);
  const [payments, setPayments] = useState(Payments);

  const [value, setValue] = useState([]);
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setValue({
      ...value,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handelChangePaiment = (e) => {
    // let val = value;
    // let i = 0;
    // let checked = e.target.checked;
    // checked && val.push(e.target.value);
    // !checked && delete value[i];
    // !checked && setValue([...value]);
    // console.log("value", e.target.value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...hotel,
      [name]: value,
    });
  };

  const handleInputChangebillEmail = (e) => {
    setbillEmail(e.target.value);
  };
  const handleInputChangeOrder = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };
  const handleInputChangeOrderProducts = (e) => {
    const { name, value } = e.target;
    setProducts({
      ...Products,
      [name]: value,
    });
  };
  const handleInputChangeOrderPayements = (e) => {
    const { name, value } = e.target;
    setPayments({
      ...payments,
      [name]: value,
    });
  };
  const HandelCode = () => {
    setCode(!code);
    // console.log(`code`, code);
  };
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (data) => {
    // console.log(data);
    await dispatch({ type: "LOGIN_REQUEST", payload: data });
  };
  const navigateToSuccess = () => {
    navigate("/succes");
  };

  const state = useSelector((state) => state.handleCart);
  const Resto = useSelector((state) => state.Restaurants);
  const { Delivery } = Resto;

  let sum = 0;
  let all = 0;
  state.map((i) => {
    sum += i.quantity * i.price;
    all = sum + Delivery;
  });
  const lengthRegEx = /(?=.{8,})/;
  const phoneRegex =
    /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;

  let validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(8, "le nom est trop court - doit ??tre de 8 caract??res minimum.")
      .max(
        35,
        "Le nom complet est trop long - doit ??tre de 35 caract??res maximum."
      )
      .matches(lengthRegEx, "Doit contenir au moins 8 caract??res??!")
      .required("le nom complet est requis"),

    phone: Yup.string()
      .min(10, "Num??ro t??l??phone is too short - should be 10 number Minimum.")
      .matches(phoneRegex, "Doit ??tre un num??ro valide??!")
      .required("Num??ro t??l??phone est requis"),

    apartement: Yup.number()
      // .max(
      //   "Le num??ro d'appartement est trop long - doit ??tre de 2 num??ros maximum."
      // )
      .required("Le num??ro d'appartement est requis"),
    voucher_code: Yup.string().min(
      4,
      "le code promotionnel est trop court - doit comporter au moins 4 caract??res "
    ),
  });

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    handleInputChange,
    hotel,
    setValues,
    code,
    HandelCode,
    handleInputChangeOrder,
    order,
    setOrder,
    handleInputChangebillEmail,
    bill,
    setProducts,
    setPayments,
    products,
    payments,
    handleInputChangeOrderProducts,
    handleInputChangeOrderPayements,
    value,
    handelChangePaiment,
    dispatch,
    navigateToSuccess,
    validationSchema,
    all,
    sum,
    onChangeInput,
  };
}
