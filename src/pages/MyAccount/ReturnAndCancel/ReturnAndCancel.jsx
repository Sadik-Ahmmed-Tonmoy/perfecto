import React from "react";
import {useForm} from "react-hook-form";
import {FaStarOfLife} from "react-icons/fa6";
import {SearchSelectLabelLess} from "../../../components/SearchSelectLabelLess/SearchSelectLabelLess";
import Button from "../../../components/ui/Button";

const ReturnAndCancel = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm();

    const onSubmit = (data) => {

    }


    return (
        <>
            <div style={{boxShadow: "0px 0px 8px 0px rgba(228, 237, 240, 0.65)"}} className="rounded-lg bg-white">
                <div className="py-3 ps-3 md:py-5 md:ps-8 border-b-[0.5px] border-[#ECECEC]">
                    <h3 className="text-black text-opacity-80 font-inter text-xl lg:text-2xl font-semibold leading-[33.5px]">Returns & Cancel</h3>
                </div>
                <div className="pt-3 px-3 md:mb-3 md:pt-6 md:px-8">
                    <p className="text-black font-Inter text-lg font-medium leading-normal mb-5">Returns Policy:</p>
                    <p>
                        We want you to be completely satisfied with your purchase. If for any reason you are not satisfied, we will gladly accept
                        returns within 30 days of purchase. Please ensure that the item is unused and in its original condition with all tags
                        attached. Returns can be made in-store or by mail.
                    </p>
                </div>
                <div className="pt-3 px-3 md:mb-3 md:pt-6 md:px-8 pb-10">
                    <p className="text-black font-Inter text-lg font-medium leading-normal mb-5">Cancellation Policy:</p>
                    <p>
                        If you need to cancel your order, please contact us as
                        soon as possible. Orders can only be canceled before they have been shipped. Once an order has been shipped, it cannot be
                        canceled, but you can initiate a return once you receive the item. We strive to process all cancellations promptly to ensure
                        customer satisfaction.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ReturnAndCancel;
