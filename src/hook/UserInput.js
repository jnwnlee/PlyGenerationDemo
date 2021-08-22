import { useState } from "react";

export const UserInput = initialValue => {
    const [value, setValue] = useState(initialValue);
  
    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        }
      }
    };
  };

/*export const UserInput = (initialValue, validator) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (event) => {
      const {
        target: { value }
      } = event;
      let willUpdate = true;
      if (typeof validator == "function") {
        willUpdate = validator(value);
      }
      if (willUpdate) {
        setValue(value);
      }
      console.log("Search Token: ",value);
    };
    return { value, onChange };
  };*/