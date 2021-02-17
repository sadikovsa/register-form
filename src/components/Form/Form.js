import React, { useState } from 'react';
import formatString from "format-string-by-pattern";
import { formatDistanceStrict,isValid } from 'date-fns'
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from "@date-io/date-fns";
import { Form, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { Checkbox, TextField } from 'final-form-material-ui';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
    FormControlLabel,
    Container
} from '@material-ui/core';

// Picker
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const onSubmit = values => {
    window.alert( JSON.stringify( values, 0, 2 ) );
};

const validate = values => {
    const errors = {};
    if ( !values.name ) {
        errors.name = 'Пожалуйста заполните данное поле';
    }
    if ( !values.birthDate ) {
        errors.birthDate = 'Пожалуйста заполните данное поле';
    }
    if ( !values.address ) {
        errors.address = 'Пожалуйста заполните данное поле';
    }
    if ( !values.factAddress ) {
        errors.factAddress = 'Пожалуйста заполните данное поле';
    }
    if ( !values.inipa ) {
        errors.inipa = 'Пожалуйста заполните данное поле';
    }
    if ( values.inipa && values.inipa.length < 11 ) {
        errors.inipa = 'Минимум 11 символов';
    }
    if ( !values.tin ) {
        errors.tin = 'Пожалуйста заполните данное поле';
    }
    if ( values.tin && values.tin.length < 12 ) {
        errors.tin = 'Минимум 12 символов';
    }
    if ( !values.passport ) {
        errors.passport = 'Пожалуйста заполните данное поле';
    }
    if ( values.tin && values.passport.length < 11 ) {
        errors.passport = 'Минимум 11 символов';
    }
    if ( !values.departmentCode ) {
        errors.departmentCode = 'Пожалуйста заполните данное поле';
    }
    if ( values.departmentCode && values.departmentCode.length < 6 ) {
        errors.departmentCode = 'Минимум 6 символов';
    }
    if ( !values.issueDate ) {
        errors.issueDate = 'Пожалуйста заполните данное поле';
    }
    return errors;
};
const initialValues = {
    name: '',
    birthDate: '',
    address: '',
    compareAddress: false,
    factAddress: '',
    inipa: '',
    tin: '',
    passport: '',
    departmentCode: '',
    issueDate: ''
};
const DatePickerWrapper = ( props ) => {
    const {
        input: { name, onChange, value, ...restInput },
        meta,
        ...rest
    } = props;
    const showError =
        ( ( meta.submitError && !meta.dirtySinceLastSubmit ) || meta.error ) &&
        meta.touched;

    return (
        <KeyboardDatePicker
            {...rest}
            name={name}
            helperText={showError ? meta.error || meta.submitError : undefined}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            format="dd.MM.yyyy"
            openTo="year"
            views={[ "year", "month", "date" ]}
            value={value === '' ? null : value}
        />
    );
};

const formatOnlyNumbers = ( anyString, format ) => {
    const onlyNumbers = anyString.replace( /[^\d]/g, '' );
    return formatString( format, onlyNumbers );
};

const RegisterForm = () => {
    const [ formData, setFormData ] = useState( initialValues );
    const [ year, setYear ] = useState( '' );
    return (
        <Container>
            <CssBaseline/>
            <Typography variant="h4" align="left" component="h2" gutterBottom>
                Личные данные
            </Typography>
            <Form
                onSubmit={onSubmit}
                initialValues={formData}
                validate={validate}
                render={( { handleSubmit, form, submitting, pristine, values } ) => (
                    <form onSubmit={handleSubmit} noValidate>
                        <Paper style={{ padding: 16 }}>
                            <Grid container alignItems="flex-start" spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        fullWidth
                                        required
                                        name="name"
                                        component={TextField}
                                        type="text"
                                        label="ФИО"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                        <Field
                                            name="birthDate"
                                            component={DatePickerWrapper}
                                            fullWidth
                                            label="Дата рождения"
                                        />
                                        <OnChange name="birthDate">
                                            {(value, previous) => {
                                                if(value !== previous) {
                                                    setYear(value);
                                                }
                                            }}
                                        </OnChange>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Typography align="right" component="p">
                                        {year && isValid(year) ? formatDistanceStrict( Date.parse(year), Date.now(), {
                                            addSuffix: false,
                                            locale: ruLocale
                                        } ): null}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Field
                                        fullWidth
                                        required
                                        name="address"
                                        component={TextField}
                                        type="text"
                                        label="Адрес регистрации"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        label="Совпадает с адресом фактического проживания"
                                        control={
                                            <Field
                                                name="compareAddress"
                                                component={Checkbox}
                                                type="checkbox"
                                            />
                                        }
                                    />
                                    <OnChange name="compareAddress">
                                        {(value, previous) => {
                                            if(value !== previous) {
                                                const newFormData = {...values, factAddress: values.address};
                                                setFormData(newFormData);
                                                console.log(formData);
                                            }
                                        }}
                                    </OnChange>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        fullWidth
                                        required
                                        name="factAddress"
                                        component={TextField}
                                        type="text"
                                        label="Адрес фактического проживания"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Field
                                        fullWidth
                                        required
                                        name="inipa"
                                        component={TextField}
                                        parse={( value ) => formatOnlyNumbers( value, '11111111111' )}
                                        formatOnBlur
                                        type="text"
                                        label="СНИЛС"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        fullWidth
                                        required
                                        name="tin"
                                        component={TextField}
                                        parse={( value ) => formatOnlyNumbers( value, '111111111111' )}
                                        formatOnBlur
                                        type="text"
                                        label="ИНН"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5} lg={6}>
                                    <Field
                                        fullWidth
                                        required
                                        name="passport"
                                        component={TextField}
                                        parse={( value ) => formatOnlyNumbers( value, '1234 123456' )}
                                        formatOnBlur
                                        type="text"
                                        label="Серия и номер паспорта"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} lg={3}>
                                    <Field
                                        fullWidth
                                        required
                                        name="departmentCode"
                                        component={TextField}
                                        parse={( value ) => formatOnlyNumbers( value, '123-123' )}
                                        formatOnBlur
                                        type="text"
                                        label="Код подрозделения"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                        <Field
                                            name="issueDate"
                                            component={DatePickerWrapper}
                                            fullWidth
                                            label="Дата выдачи"
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>


                                <Grid item xs={6} sm={2} style={{ marginTop: 16 }}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        onClick={form.reset}
                                        disabled={submitting || pristine}
                                    >
                                        Сбросить
                                    </Button>
                                </Grid>
                                <Grid item xs={6} sm={2} style={{ marginTop: 16 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        Отправить
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                )}
            />
        </Container>
    );

};

export default RegisterForm;