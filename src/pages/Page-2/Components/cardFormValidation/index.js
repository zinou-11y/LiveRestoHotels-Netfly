import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  TextField,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { submitValidation } from "../../../../redux/actions/validation/actionValidation";
import Dates from "./components/Dates";
import DetailsPersonnel from "./components/DetailsPersonnel";
import ModePaiment from "./components/ModePaiment";
import Remarques from "./components/Remarques";
import { useValidation } from "./Hooks/useValidation";
import useStyles from "./styles";
import { Field, Form, Formik } from "formik";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
let Hotel = {
  fullName: "",
  phone: "",
  apartement: "",
};
let billaddress = {};

let Products = "";
let Payments = "";

let orderState = {
  customer_id: "",
  establishment_id: "",
  for_when: "",
  delivery_address_id: "",
  bill_address_id: "",
  voucher_code: "",
  use_loyalty: "",
  comment: "",
  origin_id: "",
  total: "",
};

function ValidationForm(props) {
  const { closeValidate } = props;
  const classes = useStyles();
  let params = useParams();
  let { id } = params;
  const Validate = useSelector((state) => state.Validate);
  const state = useSelector((state) => state.handleCart);
  const auth = useSelector((state) => state.auth);
  const { data } = auth;
  const { customer } = data;
  const [hotel, setdata] = useState(Hotel);
  const [IdPaiement, setIdPaiement] = useState(1);
  const [Cheque, setCheque] = useState(0);
  const [Ticket, setTicket] = useState(0);
  const [Especes, setEspeces] = useState(0);
  const [check, setCheck] = useState(true);
  const [IdArr, setIdArr] = useState([]);
  console.log("IdArr", IdArr);
  const {
    register,
    order,
    setOrder,
    code,
    HandelCode,
    handleInputChangeOrder,
    handleInputChangebillEmail,
    bill,
    products,
    setProducts,
    payments,
    setPayments,
    value,
    handelChangePaiment,
    dispatch,
    navigateToSuccess,
    validationSchema,
    all,
    sum,
    onChangeInput,
  } = useValidation(Hotel, orderState, billaddress, Products, Payments);
  const handelTotal = () => {
    customer &&
      setOrder({
        ...order,
        ["total"]: all.toFixed(2),
        ["establishment_id"]: id,
        // ["origin_id"]: customer.origin_id,
        ["origin_id"]: 2,
        ["customer_id"]: customer.id,
        ["profile_id"]: customer.profile_id,
        ["use_loyalty"]: customer.loyalty,
        ["bill_address_id"]: 14808,
        ["delivery_address_id"]: 14808,
      });
  };
  const HandelProducts = () => {
    customer &&
      setProducts(
        state.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          comment: null,
          extras: null,
        }))
      );
  };
  const GetCheque = (e) => {
    const { name, value } = e.target;
    setCheque({
      ...value,
      [name]: value,
    });
  };
  const GetTicket = (e) => {
    const { name, value } = e.target;
    setTicket({
      ...value,
      [name]: value,
    });
  };
  const GetEspèces = (e) => {
    const { name, value } = e.target;
    setEspeces({
      ...value,
      [name]: value,
    });
  };
  const HandelPayments = () => {
    customer &&
      setPayments([
        {
          id: 3,
          amount: Cheque?.amount || 0,
        },
        {
          id: 5,
          amount: Ticket?.amount || 0,
        },
        {
          id: 4,
          amount: Especes?.amount || 0,
        },
      ]);
  };
  const HandelHotel = (values) => {
    setdata(values);
  };
  const handelId = (id) => {
    if (id == "2") setIdPaiement(2);
    if (id == "1") setIdPaiement(1);
    if (id == "5") setIdPaiement(5);
    if (id == "3") setIdPaiement(3);
  };

  const calculeSum = () => {
    let sum =
      parseFloat(Cheque?.amount || (0).toFixed(2)) +
      parseFloat(Ticket?.amount || (0).toFixed(2)) +
      parseFloat(Especes?.amount || (0).toFixed(2));
    // console.log(
    //   "sum",
    //   sum,
    //   all,
    //   Especes?.amount,
    //   Ticket?.amount,
    //   Cheque?.amount
    // );

    setCheck(sum);
  };

  useEffect(() => {
    handelTotal();
    HandelProducts();
    HandelPayments();
    calculeSum();
  }, [
    sum,
    state,
    value,
    IdPaiement,
    Cheque?.amount,
    Ticket?.amount,
    Especes?.amount,
    all,
    Cheque,
    Ticket,
    Especes,
  ]);
  let orders = {
    hotel,
    order: {
      customer_id: order.customer_id,
      establishment_id: order.establishment_id,
      for_when: order.for_when,
      delivery_address_id: order.delivery_address_id,
      bill_address_id: order.bill_address_id,
      voucher_code: order.voucher_code,
      use_loyalty: order.use_loyalty,
      comment: order.comment,
      origin_id: order.origin_id,
      total: order.total,
      payments,
      products,
    },
    bill: bill,
  };
  // console.log("orders", orders);

  const Token = localStorage.getItem("token");

  let configHead = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "fr",
      Authorization: `Bearer ${Token}`,
    },
  };

  const Hours = useSelector((state) => state.Hours);
  return (
    <Paper className={classes.IndexPanier} elevation={0}>
      <Formik
        className={classes.FormikHotelInfo}
        initialValues={hotel}
        validationSchema={validationSchema}
      >
        {(formik) => {
          HandelHotel(formik.values);
          return [
            <Form
              autoComplete="on"
              name="hotel"
              className={classes.FormikHotelInfoForm}
            >
              <DetailsPersonnel
                formik={formik}
                code={code}
                order={order}
                HandelCode={HandelCode}
                onChangeInput={onChangeInput}
              />
            </Form>,
          ];
        }}
      </Formik>
      <Dates handleInputChangeOrder={handleInputChangeOrder} order={order} />

      <Box className={classes.dateContainer}>
        <Box component="legend" className={classes.InformationTitre}>
          Mode Paiement :
        </Box>

        <Accordion style={{ margin: "0px 5px 0px 0" }} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ fontWeight: 600 }}>
              Choisir un mode :
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik initialValues={value}>
              {(formik) => {
                // console.log("formik.values", formik);
                handelId(formik.values.id);

                return [
                  <Form
                    className={classes.FormItemsPaiements}
                    autoComplete="on"
                  >
                    <ModePaiment
                      formik={formik}
                      handelChangePaiment={handelChangePaiment}
                      value={value}
                      Cheque={Cheque}
                      GetCheque={GetCheque}
                      GetTicket={GetTicket}
                      Ticket={Ticket}
                      GetEspèces={GetEspèces}
                      Especes={Especes}
                      check={check}
                      all={all}
                    />
                  </Form>,
                ];
              }}
            </Formik>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Remarques
        handleInputChangeOrder={handleInputChangeOrder}
        order={order}
        register={register}
        handleInputChangebillEmail={handleInputChangebillEmail}
        billaddress={billaddress}
      />
      {Validate.error && (
        <span className={classes.spanError}>{Validate.error.message}</span>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        className={classes.BTNM}
        onClick={() => {
          submitValidation(
            dispatch,
            orders,
            configHead,
            closeValidate,
            navigateToSuccess
          );
        }}
        disabled={Hours.data.reason ? true : false}
        disabled={hotel.fullName.length >= 8 ? false : true}
        disabled={hotel.phone.length > 10 ? false : true}
        disabled={hotel.apartement ? false : true}
        disabled={check !== all ? true : false}
        // disabled={Object.keys(IdArr)?.includes("3") || Object.keys(IdArr)?.includes("4") || Object.keys(IdArr)?.includes("5") ? true : false}
      >
        Passer ma commande
        {Validate.loading && (
          <CircularProgress
            color="black"
            className={classes.circularProgress}
            size={20}
          />
        )}
      </Button>
    </Paper>
  );
}

export default ValidationForm;

{
  /* {IdPaiement
                ? IdPaiement === 1
                  ? "Chèques"
                  : IdPaiement === 2
                  ? "Espèces"
                  : IdPaiement === 3
                  ? "Ticket restaurant"
                  : IdPaiement === 0
                  ? "CB en ligne"
                  : ""
                :  */
}
{
  /* <Field
                      label={"Chèques"}
                      value={Cheque.amount}
                      onChange={GetCheque}
                      name="amount"
                      required
                      as={TextField}
                    /> */
}
{
  /* <Field
                      label={"Ticket restaurant"}
                      value={Ticket.amount}
                      onChange={GetTicket}
                      name="amount"
                      required
                      as={TextField}
                    />
                    <Field
                      label={"Espèces"}
                      value={Especes.amount}
                      onChange={GetEspèces}
                      name="amount"
                      required
                      as={TextField}
                    /> */
}
