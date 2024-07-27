import DatePicker from "react-datepicker";
import { Button, Select } from "semantic-ui-react";
import { ClientOnly } from "remix-utils/client-only";

export const CustomDatePicker: React.FC<{
  onChange(
    date: Date | null,
    event?: React.SyntheticEvent<unknown, Event>,
  ): any;
  selected: Date | null;
}> = ({ onChange, selected }) => {
  const years = Array.from({ length: 50 }, (_, index) => {
    const yr = (1990 + index).toString();
    return { key: yr, value: yr, text: yr + " 年" };
  });

  const months = [
    { key: 1, value: 1, text: "1 月" },
    { key: 2, value: 2, text: "2 月" },
    { key: 3, value: 3, text: "3 月" },
    { key: 4, value: 4, text: "4 月" },
    { key: 5, value: 5, text: "5 月" },
    { key: 6, value: 6, text: "6 月" },
    { key: 7, value: 7, text: "7 月" },
    { key: 8, value: 8, text: "8 月" },
    { key: 9, value: 9, text: "9 月" },
    { key: 10, value: 10, text: "10 月" },
    { key: 11, value: 11, text: "11 月" },
    { key: 12, value: 12, text: "12 月" },
  ];

  return (
    <ClientOnly>
      {() => (
        <DatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect
          timeIntervals={10}
          dateFormat="yyyy/MM/dd HH:mm"
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div
              style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
              }}
              className="imken-date-picker"
            >
              <Button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                icon="left arrow"
              />
              <Select
                search
                value={date.getFullYear().toString()}
                onChange={(_, { value }) => changeYear(parseInt(String(value)))}
                options={years}
              ></Select>

              <Select
                search
                value={date.getMonth() + 1}
                onChange={(_, { value }) =>
                  changeMonth(parseInt(String(value)) - 1)
                }
                options={months}
              ></Select>
              <Button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                icon="right arrow"
              />
            </div>
          )}
        />
      )}
    </ClientOnly>
  );
};
