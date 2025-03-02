import React from "react";
import {Select, Spin} from "antd";
import debounce from "lodash.debounce";

export function  DebounceSelect({ fetchOptions, onFetched, debounceTimeout = 800, ...props }){
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                // onFetched(res);
                // const listData = res.data;
                // const newOptions = listData.map(data => ({
                //     label: `${data.user.username} - ${data.user.name}`,
                //     value: data.id
                // }))
                // console.log(value, newOptions)

                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}