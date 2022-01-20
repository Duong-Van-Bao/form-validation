// @ts-nocheck
// Đối tượng 'Validator'
function Validator(options) {
    var selectorRules = {};

    // Hàm thực hiện calidate
    function validate(inputElement, rule) {    
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        console.log(errorMessage);    

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule & kiểm tra 
        //Nếu có lỗi thì dừng việc kiểm tra  
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errorMessage;
    }
    //lấy element của form cần validate
    var formElement = document.querySelector(options.form);


    if (formElement) {
        //khi submit form
        formElement.onsubmit = function(e) {
                e.preventDefault();
            
                var isFormValaid = true;

                console.log('data');
                //Thực hiện lặp từng rules và validate 
                options.rules.forEach(function(rule) {
                    var inputElement = formElement.querySelector(rule.selector);
                    var isValaid = validate(inputElement, rule);
                    console.log('data');
                    if (!isValaid) {
                        isFormValaid = false;
                        console.log('check');
                    }
                });

                if (isFormValaid) {
                    // Trường hợp submit với javaScript
                    if (typeof options.onSubmit === 'function') {
                        var enableInputs = formElement.querySelectorAll('[name]');
                        var formValue = Array.from(enableInputs).reduce(function(value, input) {
                            return (value[input.name] = input.value) && value;
                        }, {});
                        options.onSubmit(formValue)
                    }
                    // Trường hợp submit với hành vi mặc định 
                    else {
                        console.log(formElement);
                        formElement.submit();
                    }
                }
            }
            //Lặp qua mỗi rule và xử lý (lăng nghe sự kiện blur,input,...)
        options.rules.forEach(function(rule) {

            //Lưu lại các rules cho mỗi input 
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            // selectorRules[rule.selector] = rule.test;

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input 
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

// Định nghĩa rules
//Nguyên tắc của các rules:
//1.khi có lỗi => Trả ra messae lỗi
//2.khi hợp lệ => không trả ra cài gì cả(undefined)    
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tôi thiểu ${min} ký tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}