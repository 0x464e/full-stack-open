import { useEffect, useState } from 'react';
import { getCountry } from '../services/Countries';

export const useField = (type) => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange
    };
};

export const useCountry = (name) => {
    const [country, setCountry] = useState(null);

    useEffect(() => {
        if (!name)
            return;

        getCountry(name).then(country => {
            setCountry({
                data: {
                    name: country.name.common,
                    capital: country.capital.find(() => true),
                    population: country.population,
                    flag: country.flags.svg
                },
                found: true
            });
        })
            .catch(() => setCountry({ found: false }));
    }, [name]);

    return country;
};
