/* eslint-disable react/prop-types */
import React, {useEffect} from "react";
import Select from "react-select";
import {twMerge} from "tailwind-merge";
import './ReactSelect.css'

export const ReactSelect = ({label, mbHide, name, placeholder, setSelectedValue, isDisabled = true, data, className, height, isClearable = true, ...props}) => {
    const handleChange = (e) => {
        if (e) {
            setSelectedValue({
                selected_item_id: e.value,
                selected_item_name: e.label,
            });
        }
    };

    return (
        <div>
            {/*{label && <Lavel className="text-start mb-2">{label} {props.required && <span className="text-red-500">*</span>}</Lavel>}*/}

            {/*<Input placeholder="" Width="400px" />*/}
            <Select
                {...props}
                className={twMerge("w-full mb-2 md:w-50 whitespace-nowrap ", className)}
                options={data}
                onChange={handleChange}
                placeholder={placeholder}
                isClearable={isClearable}
                isDisabled={isDisabled}
                // required={true}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: state.isFocused ? "#bfbfbf" : "#bfbfbf",
                        // boxShadow: "0px 0px 6px #d5d5d5",
                        borderRadius: 2,
                        height: height,
                        // maxHeight:10,
                        minHeight: 38,
                        alignItems: "center",
                        color: "red",
                    }),
                    input: (styles) => ({...styles, borderColor: "#54d487"}),
                    menuPortal: base => ({...base, zIndex: 9999}),
                    option: (styles) => ({
                        ...styles,
                        color: "#41A9E7", // Change the text color of options here
                        // color: "#F5CCDC", // Change the text color of options here
                        // color: "#F40F6F", // Change the text color of options here
                    }),
                }}
                menuPortalTarget={document.body}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: "#ddd",
                        primary: "#d4f3ff",
                    },
                })}
            />
        </div>
    );
};
