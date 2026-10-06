/**
 * HỆ THỐNG MÃ ĐỊNH DANH TOÁN THCS VÀ THPT (LỚP 6 - LỚP 12)
 * Chuẩn Quốc Gia GDPT 2018 / ID Toán Học Việt Nam
 * 
 * Quy tắc mã định dạng: [Lớp][Phân môn][Chương][Mức độ][Bài]-[Dạng]
 * - Lớp: 6, 7, 8, 9, 0 (Lớp 10), 1 (Lớp 11), 2 (Lớp 12)
 * - Phân môn: D (Đại số, Giải tích, Thống kê, Xác suất), H (Hình học, Đo lường, Tọa độ)
 * - Mức độ: N (Nhận biết), H (Thông hiểu), V (Vận dụng), C (Vận dụng cao)
 */

(function(window) {
    'use strict';

    const MATH_ID_TAXONOMY = {
        // =====================================================================
        // LỚP 6 (Ký hiệu: 6)
        // =====================================================================
        "6": {
            gradeName: "Toán Lớp 6",
            code: "6",
            branches: {
                "D": {
                    name: "Số và Thống kê, Xác suất",
                    chapters: {
                        "1": {
                            name: "Số tự nhiên",
                            lessons: {
                                "1": { name: "Tập hợp. Phần tử của tập hợp", types: { "1": "Làm quen với tập hợp", "2": "Các kí hiệu", "3": "Cách cho tập hợp", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Tập hợp số tự nhiên. Ghi số tự nhiên", types: { "1": "Tập hợp N và N*", "2": "Thứ tự trong tập hợp số tự nhiên", "3": "Ghi số tự nhiên", "4": "Bài Toán Thực Tế" } },
                                "3": { name: "Các phép tính trong tập hợp số tự nhiên", types: { "1": "Phép cộng và phép nhân", "2": "Tính chất của phép cộng và phép nhân số tự nhiên", "3": "Phép trừ và phép chia hết", "4": "Bài Toán Thực Tế" } },
                                "4": { name: "Luỹ thừa với số mũ tự nhiên", types: { "1": "Luỹ thừa", "2": "Nhân hai luỹ thừa cùng cơ số", "3": "Chia hai luỹ thừa cùng cơ số", "4": "Bài Toán Thực Tế" } },
                                "5": { name: "Thứ tự thực hiện các phép tính", types: { "1": "Thứ tự thực hiện các phép tính", "2": "Sử dụng máy tính cầm tay", "3": "Bài Toán Thực Tế" } },
                                "6": { name: "Chia hết và chia có dư. Tính chất chia hết của một tổng", types: { "1": "Chia hết và chia có dư", "2": "Tính chất chia hết của một tổng", "3": "Bài toán thực tế" } },
                                "7": { name: "Dấu hiệu chia hết cho 2, cho 5", types: { "1": "Dấu hiệu chia hết cho 2", "2": "Dấu hiệu chia hết cho 5", "3": "Bài Toán Thực Tế" } },
                                "8": { name: "Dấu hiệu chia hết cho 3, cho 9", types: { "1": "Dấu hiệu chia hết cho 9", "2": "Dấu hiệu chia hết cho 3", "3": "Bài Toán Thực Tế" } },
                                "9": { name: "Ước và bội", types: { "1": "Ước và bội", "2": "Cách tìm ước", "3": "Cách tìm bội", "4": "Bài Toán Thực Tế" } },
                                "A": { name: "Số nguyên tố. Hợp số. Phân tích một số ra thừa số nguyên tố", types: { "1": "Số nguyên tố. Hợp số", "2": "Phân tích một số ra thừa số nguyên tố", "3": "Bài Toán thực tế" } },
                                "B": { name: "Ước chung. Ước chung lớn nhất", types: { "1": "Ước chung", "2": "Ước chung lớn nhất", "3": "Tìm ƯCLN bằng phân tích ra thừa số nguyên tố", "4": "Ứng dụng trong rút gọn phân số", "5": "Bài Toán Thực Tế" } },
                                "C": { name: "Bội chung. Bội chung nhỏ nhất", types: { "1": "Bội chung", "2": "Bội chung nhỏ nhất", "3": "Tìm BCNN bằng phân tích ra thừa số nguyên tố", "4": "Ứng dụng trong quy đồng mẫu các phân số", "5": "Bài Toán Thực Tế" } }
                            }
                        },
                        "2": {
                            name: "Số nguyên",
                            lessons: {
                                "1": { name: "Số nguyên âm và tập hợp các số nguyên", types: { "1": "Làm quen với số nguyên âm", "2": "Tập hợp số nguyên", "3": "Biểu diễn số nguyên trên trục số", "4": "Số đối của một số nguyên", "5": "Bài Toán Thực Tế" } },
                                "2": { name: "Thứ tự trong tập hợp số nguyên", types: { "1": "So sánh hai số nguyên", "2": "Thứ tự trong tập hợp số nguyên", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Phép cộng và phép trừ hai số nguyên", types: { "1": "Cộng hai số nguyên cùng dấu", "2": "Cộng hai số nguyên khác dấu", "3": "Tính chất phép cộng các số nguyên", "4": "Phép trừ hai số nguyên", "5": "Quy tắc dấu ngoặc", "6": "Bài Toán Thực Tế" } },
                                "4": { name: "Phép nhân và phép chia hai số nguyên", types: { "1": "Nhân hai số nguyên khác dấu", "2": "Nhân hai số nguyên cùng dấu", "3": "Tính chất phép nhân các số nguyên", "4": "Quan hệ chia hết và phép chia hết (Bài toán tìm x)", "5": "Bội và ước của một số nguyên", "6": "Bài Toán Thực Tế" } }
                            }
                        },
                        "3": {
                            name: "Một số yếu tố thống kê",
                            lessons: {
                                "1": { name: "Thu thập và phân loại dữ liệu", types: { "1": "Thu thập dữ liệu", "2": "Phân loại dữ liệu", "3": "Tính hợp lí của dữ liệu", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Biểu diễn dữ liệu trên bảng", types: { "1": "Bảng dữ liệu ban đầu", "2": "Bảng thống kê", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Biểu đồ tranh", types: { "1": "Ôn tập và bổ sung kiến thức", "2": "Đọc biểu đồ tranh", "3": "Vẽ biểu đồ tranh", "4": "Bài Toán Thực Tế" } },
                                "4": { name: "Biểu đồ cột - biểu đồ cột kép", types: { "1": "Ôn tập biểu đồ cột", "2": "Đọc biểu đồ cột", "3": "Vẽ biểu đồ cột", "4": "Giới thiệu biểu đồ kép", "5": "Đọc biểu đồ kép", "6": "Vẽ biểu đồ kép", "7": "Bài toán thực tế" } }
                            }
                        },
                        "4": {
                            name: "Phân số",
                            lessons: {
                                "1": { name: "Phân số với tử số và mẫu số là số nguyên", types: { "1": "Mở rộng khái niệm phân số", "2": "Phân số bằng nhau", "3": "Biểu diễn số nguyên ở dạng phân số", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Tính chất cơ bản của phân số", types: { "1": "Tính chất 1 (nhân tử mẫu cùng một số nguyên)", "2": "Tính chất 2 (chia tử mẫu cùng một số nguyên)", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "So sánh phân số", types: { "1": "So sánh hai phân số cùng mẫu", "2": "So sánh hai phân số khác mẫu", "3": "Áp dụng quy tắc so sánh phân số", "4": "Bài Toán Thực Tế" } },
                                "4": { name: "Phép cộng và phép trừ phân số", types: { "1": "Phép cộng hai phân số", "2": "Một số tính chất của phép cộng phân số", "3": "Số đối", "4": "Phép trừ hai phân số", "5": "Bài Toán Thực Tế" } },
                                "5": { name: "Phép nhân và phép chia phân số", types: { "1": "Nhân hai phân số", "2": "Một số tính chất của phép nhân phân số", "3": "Chia phân số", "4": "Bài Toán Thực Tế" } },
                                "6": { name: "Giá trị phân số của một số", types: { "1": "Tính giá trị phân số của một số", "2": "Tìm một số khi biết giá trị phân số của số đó", "3": "Bài Toán tìm x", "4": "Bài Toán Thực Tế" } },
                                "7": { name: "Hỗn số", types: { "1": "Hỗn số", "2": "Đổi hỗn số ra phân số", "3": "Bài Toán Thực Tế" } }
                            }
                        },
                        "5": {
                            name: "Số thập phân",
                            lessons: {
                                "1": { name: "Số thập phân", types: { "1": "Số thập phân âm", "2": "Số đối của một số thập phân", "3": "So sánh hai số thập phân", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Các phép tính với số thập phân", types: { "1": "Cộng, trừ hai số thập phân", "2": "Nhân, chia hai số thập phân dương", "3": "Nhân, chia hai số thập phân có dấu bất kì", "4": "Tính chất của các phép tính với số thập phân", "5": "Bài Toán Thực Tế" } },
                                "3": { name: "Làm tròn số thập phân và ước lượng kết quả", types: { "1": "Làm tròn số thập phân", "2": "Ước lượng kết quả", "3": "Bài Toán Thực Tế" } },
                                "4": { name: "Tỉ số và tỉ số phần trăm", types: { "1": "Tỉ số của hai đại lượng", "2": "Tỉ số phần trăm của hai đại lượng", "3": "Bài Toán Thực Tế" } },
                                "5": { name: "Bài toán về tỉ số phần trăm", types: { "1": "Tìm giá trị phần trăm của một số", "2": "Tìm một số khi biết giá trị phần trăm của số đó", "3": "Sử dụng tỉ số phần trăm trong thực tế" } }
                            }
                        },
                        "6": {
                            name: "Một số yếu tố xác suất",
                            lessons: {
                                "1": { name: "Phép thử nghiệm. Sự kiện", types: { "1": "Phép thử nghiệm", "2": "Sự kiện", "3": "Bài Toán Thực Tế" } },
                                "2": { name: "Xác suất thực nghiệm", types: { "1": "Khả năng xảy ra của một sự kiện", "2": "Xác suất thực nghiệm", "3": "Bài Toán Thực Tế" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học và Đo lường",
                    chapters: {
                        "1": {
                            name: "Các hình phẳng trong thực tiễn",
                            lessons: {
                                "1": { name: "Hình Vuông - Tam Giác Đều - Lục Giác Đều", types: { "1": "Hình vuông", "2": "Tam giác đều", "3": "Lục giác đều", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Hình Chữ Nhật - Hình Thoi - Hình Bình Hành - Hình Thang Cân", types: { "1": "Hình chữ nhật", "2": "Hình thoi", "3": "Hình bình hành", "4": "Hình thang cân", "5": "Bài Toán Thực Tế" } },
                                "3": { name: "Chu Vi và Diện Tích của một số hình trong thực tiễn", types: { "1": "Chu vi và diện tích hình chữ nhật, hình vuông, tam giác, hình thang", "2": "Tính chu vi và diện tích hình bình hành, hình thoi", "3": "Tính chu vi và diện tích một số hình trong thực tiễn" } }
                            }
                        },
                        "2": {
                            name: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
                            lessons: {
                                "1": { name: "Hình có trục đối xứng", types: { "1": "Hình có trục đối xứng. Trục đối xứng", "2": "Nhận biết hình phẳng trong tự nhiên có trục đối xứng", "3": "Bài Toán Thực Tế" } },
                                "2": { name: "Hình có tâm đối xứng", types: { "1": "Hình có tâm đối xứng. Tâm đối xứng", "2": "Nhận biết hình phẳng trong tự nhiên có tâm đối xứng", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Vai trò của tính đối xứng trong thế giới tự nhiên", types: { "1": "Vẻ đẹp của thế giới tự nhiên biểu hiện qua tính đối xứng", "2": "Tính đối xứng trong khoa học kĩ thuật và đời sống" } }
                            }
                        },
                        "3": {
                            name: "Các hình hình học cơ bản",
                            lessons: {
                                "1": { name: "Điểm và đường thẳng", types: { "1": "Điểm", "2": "Đường thẳng", "3": "Vẽ đường thẳng", "4": "Điểm thuộc / không thuộc đường thẳng", "5": "Bài Toán Thực Tế" } },
                                "2": { name: "Ba điểm thẳng hàng. Ba điểm không thẳng hàng", types: { "1": "Ba điểm thẳng hàng", "2": "Quan hệ giữa ba điểm thẳng hàng", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Hai đường thẳng cắt nhau, song song. Tia", types: { "1": "Hai đường thẳng cắt nhau, song song", "2": "Tia", "3": "Bài Toán Thực Tế" } },
                                "4": { name: "Đoạn thẳng. Độ dài đoạn thẳng", types: { "1": "Đoạn thẳng", "2": "Độ dài đoạn thẳng", "3": "So sánh hai đoạn thẳng", "4": "Một số dụng cụ đo độ dài", "5": "Bài Toán Thực Tế" } },
                                "5": { name: "Trung điểm của đoạn thẳng", types: { "1": "Trung điểm của đoạn thẳng", "2": "Cách vẽ trung điểm của đoạn thẳng", "3": "Bài Toán Thực Tế" } },
                                "6": { name: "Góc", types: { "1": "Góc", "2": "Cách vẽ góc", "3": "Góc bẹt", "4": "Điểm trong góc", "5": "Bài Toán Thực Tế" } },
                                "7": { name: "Số đo góc. Các góc đặc biệt", types: { "1": "Thước đo góc", "2": "Cách đo góc. Số đo góc", "3": "So sánh hai góc", "4": "Các góc đặc biệt", "5": "Bài Toán Thực Tế" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 7 (Ký hiệu: 7)
        // =====================================================================
        "7": {
            gradeName: "Toán Lớp 7",
            code: "7",
            branches: {
                "D": {
                    name: "Số và Thống kê, Xác suất",
                    chapters: {
                        "1": {
                            name: "Số hữu tỉ",
                            lessons: {
                                "1": { name: "Tập hợp các số hữu tỉ", types: { "1": "Số Hữu Tỉ", "2": "Thứ tự trong tập hợp các Số Hữu Tỉ", "3": "Biểu diễn Số Hữu Tỉ trên trục", "4": "Số đối của Số Hữu Tỉ", "5": "Bài Toán Thực Tế" } },
                                "2": { name: "Các phép tính với số hữu tỉ", types: { "1": "Cộng và trừ 2 Số Hữu Tỉ", "2": "Tính chất của phép cộng 2 Số Hữu Tỉ", "3": "Nhân 2 Số Hữu Tỉ", "4": "Tính chất của phép nhân 2 Số Hữu Tỉ", "5": "Chia 2 Số Hữu Tỉ", "6": "Bài Toán Thực Tế" } },
                                "3": { name: "Luỹ thừa một số hữu tỉ", types: { "1": "Luỹ thừa với số mũ tự nhiên", "2": "Tích và thương 2 luỹ thừa cùng cơ số", "3": "Luỹ thừa của luỹ thừa", "4": "Bài toán tìm x (phép nhân và phép chia)", "5": "Bài Toán Thực Tế" } },
                                "4": { name: "Quy tắc dấu ngoặc và chuyển vế", types: { "1": "Quy tắc dấu ngoặc", "2": "Quy tắc chuyển vế", "3": "Thứ tự phép tính", "4": "Bài toán tìm x (kết hợp các phép tính)", "5": "Bài Toán Thực Tế" } }
                            }
                        },
                        "2": {
                            name: "Số thực",
                            lessons: {
                                "1": { name: "Số vô tỉ. Căn bậc hai số học", types: { "1": "Biểu diễn thập phân của số hữu tỉ", "2": "Số vô tỉ", "3": "Căn bậc hai số học", "4": "Tính căn bậc hai số học bằng máy tính", "5": "Bài Toán Thực Tế" } },
                                "2": { name: "Số thực. Giá trị tuyệt đối của một số thực", types: { "1": "Số thực và tập hợp các số thực", "2": "Thứ tự trong tập hợp các số thực", "3": "Trục số thực", "4": "Số đối của một số thực", "5": "Giá trị tuyệt đối của một số thực", "6": "Bài toán thực tế" } },
                                "3": { name: "Làm tròn số, ước lượng kết quả", types: { "1": "Làm tròn số", "2": "Làm tròn số căn cứ vào độ chính xác cho trước", "3": "Ước lượng các phép tính", "4": "Bài Toán Thực Tế" } }
                            }
                        },
                        "3": {
                            name: "Một số yếu tố thống kê",
                            lessons: {
                                "1": { name: "Thu thập và phân loại dữ liệu", types: { "1": "Thu thập dữ liệu", "2": "Phân loại dữ liệu theo các tiêu chí", "3": "Tính hợp lí của dữ liệu" } },
                                "2": { name: "Biểu đồ hình quạt", types: { "1": "Ôn tập về biểu đồ hình quạt tròn", "2": "Biểu diễn dữ liệu vào biểu đồ hình quạt tròn", "3": "Phân tích dữ liệu trên biểu đồ hình quạt tròn" } },
                                "3": { name: "Biểu đồ đoạn thẳng", types: { "1": "Giới thiệu biểu đồ đoạn thẳng", "2": "Vẽ biểu đồ đoạn thẳng", "3": "Đọc và phân tích dữ liệu từ biểu đồ đoạn thẳng" } }
                            }
                        },
                        "4": {
                            name: "Các đại lượng tỉ lệ",
                            lessons: {
                                "1": { name: "Tỉ lệ thức - Dãy tỉ số bằng nhau", types: { "1": "Tỉ lệ thức", "2": "Dãy tỉ số bằng nhau", "3": "Tìm x, y, z bằng dãy tỉ số bằng nhau", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Đại lượng tỉ lệ thuận", types: { "1": "Đại lượng tỉ lệ thuận", "2": "Tính chất của đại lượng tỉ lệ thuận", "3": "Các bài toán về đại lượng tỉ lệ thuận", "4": "Bài Toán Thực Tế" } },
                                "3": { name: "Đại lượng tỉ lệ nghịch", types: { "1": "Đại lượng tỉ lệ nghịch", "2": "Tính chất của các đại lượng tỉ lệ nghịch", "3": "Các bài toán về đại lượng tỉ lệ nghịch", "4": "Bài Toán Thực Tế" } }
                            }
                        },
                        "5": {
                            name: "Biểu thức đại số",
                            lessons: {
                                "1": { name: "Biểu thức số, Biểu thức đại số", types: { "1": "Biểu thức số", "2": "Biểu thức đại số", "3": "Giá trị của biểu thức số", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Đa thức một biến", types: { "1": "Đa thức một biến", "2": "Cách biểu diễn đa thức một biến", "3": "Giá trị của đa thức một biến", "4": "Nghiệm đa thức một biến" } },
                                "3": { name: "Phép cộng và phép trừ đa thức một biến", types: { "1": "Phép cộng hai đa thức một biến", "2": "Phép trừ hai đa thức một biến", "3": "Tính chất phép cộng đa thức một biến", "4": "Bài Toán Thực Tế" } },
                                "4": { name: "Phép nhân và phép chia đa thức một biến", types: { "1": "Phép nhân đa thức một biến", "2": "Phép chia đa thức một biến", "3": "Tính chất phép nhân đa thức một biến", "4": "Bài Toán Thực Tế" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học và Đo lường",
                    chapters: {
                        "1": {
                            name: "Các hình khối trong thực tiễn",
                            lessons: {
                                "1": { name: "Hình Hộp Chữ Nhật, Hình Lập Phương", types: { "1": "Hình hộp chữ nhật", "2": "Hình lập phương", "3": "Bài Toán Thực Tế" } },
                                "2": { name: "DTXQ và Thể tích HHCN và Hình Lập Phương", types: { "1": "Công thức tính DTXQ và thể tích", "2": "Một số bài toán thực tế" } },
                                "3": { name: "Hình lăng trụ đứng tam giác, tứ giác", types: { "1": "Hình lăng trụ đứng tam giác, tứ giác", "2": "Tạo lập hình lăng trụ đứng tam giác, tứ giác", "3": "Bài Toán Thực Tế" } },
                                "4": { name: "DTXQ và Thể tích hình lăng trụ đứng tam giác, tứ giác", types: { "1": "Diện tích xung quanh hình lăng trụ đứng", "2": "Thể tích hình lăng trụ đứng", "3": "DTXQ và Thể tích hình khối trong thực tiễn" } }
                            }
                        },
                        "2": {
                            name: "Hình học phẳng Góc và đường thẳng song song",
                            lessons: {
                                "1": { name: "Tìm các góc ở vị trí đặc biệt", types: { "1": "Hai góc kề bù", "2": "Hai góc đối đỉnh", "3": "Tính chất hai góc đối đỉnh", "4": "Bài Toán Thực Tế" } },
                                "2": { name: "Tia phân giác", types: { "1": "Tia Phân Giác Của Một Góc", "2": "Cách vẽ tia phân giác", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Hai đường thẳng song song", types: { "1": "Dấu hiệu nhận biết hai đường thẳng song song", "2": "Tiên đề Euclid về đường thẳng song song", "3": "Tính chất hai đường thẳng song song", "4": "Bài Toán Thực Tế" } },
                                "4": { name: "Định lí và chứng minh một định lí", types: { "1": "Định Lí là gì?", "2": "Chứng Minh Định Lí", "3": "Bài toán thực tế" } }
                            }
                        },
                        "3": {
                            name: "Hình học phẳng Tam giác",
                            lessons: {
                                "1": { name: "Góc và cạnh của một tam giác", types: { "1": "Tổng số đo 3 góc của một tam giác", "2": "Quan hệ giữa 3 cạnh của một tam giác", "3": "Bài Toán Thực Tế" } },
                                "2": { name: "Tam giác bằng nhau", types: { "1": "Hai tam giác bằng nhau", "2": "Trường hợp c.c.c", "3": "Trường hợp c.g.c", "4": "Trường hợp g.c.g", "5": "Trường hợp hai cạnh góc vuông", "6": "Trường hợp cạnh góc vuông - góc nhọn", "7": "Trường hợp cạnh huyền - góc nhọn / cạnh góc vuông", "8": "Bài Toán Thực Tế" } },
                                "3": { name: "Tam giác cân", types: { "1": "Tam Giác Cân", "2": "Tính chất của tam giác cân", "3": "Bài Toán Thực Tế" } },
                                "4": { name: "Đường vuông góc và đường xiên", types: { "1": "Quan hệ giữa cạnh và góc trong tam giác", "2": "Đường vuông góc và đường xiên", "3": "Mối quan hệ giữa đường vuông góc và đường xiên", "4": "Bài Toán Thực Tế" } },
                                "5": { name: "Đường trung trực của một đoạn thẳng", types: { "1": "Đường trung trực của đoạn thẳng", "2": "Tính chất của đường trung trực", "3": "Bài Toán Thực Tế" } },
                                "6": { name: "Tính chất 3 đường trung trực của tam giác", types: { "1": "Đường trung trực của tam giác", "2": "Tính chất 3 đường trung trực", "3": "Bài Toán Thực Tế" } },
                                "7": { name: "Tính chất 3 đường trung tuyến của tam giác", types: { "1": "Đường trung tuyến của tam giác", "2": "Tính chất 3 đường trung tuyến", "3": "Bài Toán Thực Tế" } },
                                "8": { name: "Tính chất 3 đường cao của tam giác", types: { "1": "Đường cao của tam giác", "2": "Tính chất 3 đường cao", "3": "Bài Toán Thực Tế" } },
                                "9": { name: "Tính chất 3 đường phân giác của tam giác", types: { "1": "Đường phân giác của tam giác", "2": "Tính chất 3 đường phân giác", "3": "Bài Toán Thực Tế" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 8 (Ký hiệu: 8)
        // =====================================================================
        "8": {
            gradeName: "Toán Lớp 8",
            code: "8",
            branches: {
                "D": {
                    name: "Đại số và Thống kê",
                    chapters: {
                        "1": {
                            name: "Biểu thức đại số",
                            lessons: {
                                "1": { name: "Đơn thức và đa thức nhiều biến", types: { "1": "Đơn thức và đa thức", "2": "Đơn thức thu gọn", "3": "Cộng trừ, đơn thức đồng dạng", "4": "Đa thức thu gọn", "5": "Bài Toán Thực Tế" } },
                                "2": { name: "Các phép toán với đa thức nhiều biến", types: { "1": "Cộng, trừ hai đa thức", "2": "Nhân hai đa thức", "3": "Chia đa thức cho đơn thức", "4": "Bài Toán Thực Tế" } },
                                "3": { name: "Hằng đẳng thức đáng nhớ", types: { "1": "Bình phương của một tổng, một hiệu", "2": "Hiệu của hai bình phương", "3": "Lập phương của một tổng, một hiệu", "4": "Tổng và hiệu của hai lập phương", "5": "Bài Toán Thực Tế" } },
                                "4": { name: "Phân tích đa thức thành nhân tử", types: { "1": "Phương pháp đặt nhân tử chung", "2": "Phương pháp sử dụng hằng đẳng thức", "3": "Phương pháp nhóm hạng tử", "4": "Bài Toán Thực Tế" } },
                                "5": { name: "Phân thức đại số", types: { "1": "Phân thức đại số", "2": "Hai phân thức bằng nhau", "3": "Tính chất cơ bản của phân thức", "4": "Bài Toán Thực Tế" } },
                                "6": { name: "Cộng, trừ phân thức", types: { "1": "Cộng, trừ hai phân thức cùng mẫu", "2": "Cộng, trừ hai phân thức khác mẫu", "3": "Bài Toán Thực Tế" } },
                                "7": { name: "Nhân, chia phân thức", types: { "1": "Nhân hai phân thức", "2": "Chia hai phân thức", "3": "Bài Toán Thực Tế" } }
                            }
                        },
                        "2": {
                            name: "Một số yếu tố thống kê",
                            lessons: {
                                "1": { name: "Thu thập và phân loại dữ liệu", types: { "1": "Thu thập dữ liệu", "2": "Phân loại dữ liệu theo các tiêu chí", "3": "Tính hợp lí của dữ liệu" } },
                                "2": { name: "Lựa chọn dạng biểu đồ để biểu diễn dữ liệu", types: { "1": "Lựa chọn dạng biểu đồ", "2": "Các dạng biểu diễn khác nhau cho một tập dữ liệu" } },
                                "3": { name: "Phân tích dữ liệu", types: { "1": "Phát hiện vấn đề qua phân tích dữ liệu thống kê", "2": "Giải quyết các vấn đề qua phân tích biểu đồ thống kê" } }
                            }
                        },
                        "3": {
                            name: "Hàm số và đồ thị",
                            lessons: {
                                "1": { name: "Khái niệm hàm số", types: { "1": "Khái niệm hàm số", "2": "Giá trị của hàm số", "3": "Bài toán thực tế" } },
                                "2": { name: "Toạ độ của một điểm và đồ thị của hàm số", types: { "1": "Toạ độ của một điểm", "2": "Xác định một điểm trên mặt phẳng toạ độ", "3": "Đồ thị của hàm số", "4": "Bài toán thực tế" } },
                                "3": { name: "Hàm số bậc nhất", types: { "1": "Hàm số bậc nhất", "2": "Bảng giá trị của hàm số bậc nhất", "3": "Đồ thị của hàm số bậc nhất", "4": "Bài toán thực tế" } },
                                "4": { name: "Hệ số góc của đường thẳng", types: { "1": "Hệ số góc của đường thẳng y = ax + b", "2": "Hai đường thẳng song song, cắt nhau", "3": "Bài toán thực tế" } }
                            }
                        },
                        "4": {
                            name: "Phương trình",
                            lessons: {
                                "1": { name: "Phương trình bậc nhất một ẩn", types: { "1": "Phương trình một ẩn", "2": "Phương trình bậc nhất một ẩn và cách giải", "3": "Bài toán thực tế" } },
                                "2": { name: "Giải toán bằng cách lập phương trình bậc nhất", types: { "1": "Biểu diễn một đại lượng bởi biểu thức chứa ẩn", "2": "Giải bài toán bằng cách lập phương trình bậc nhất" } }
                            }
                        },
                        "5": {
                            name: "Một số xác suất",
                            lessons: {
                                "1": { name: "Mô tả xác suất bằng tỉ số", types: { "1": "Kết quả thuận lợi", "2": "Mô tả xác suất bằng tỉ số" } },
                                "2": { name: "Xác suất lý thuyết và xác suất thực nghiệm", types: { "1": "Xác suất lý thuyết", "2": "Xác suất thực nghiệm" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học và Đo lường",
                    chapters: {
                        "1": {
                            name: "Các hình khối trong thực tiễn",
                            lessons: {
                                "1": { name: "Hình chóp tam giác đều - Hình chóp tứ giác đều", types: { "1": "Hình chóp tam giác đều - tứ giác đều", "2": "Tạo lập hình chóp tam giác đều, tứ giác đều", "3": "Bài toán thực tế" } },
                                "2": { name: "DTXQ và Thể tích hình chóp tam giác đều, tứ giác đều", types: { "1": "DTXQ của hình chóp tam giác đều, tứ giác đều", "2": "Thể tích của hình chóp tam giác đều, tứ giác đều", "3": "Bài toán thực tế" } }
                            }
                        },
                        "2": {
                            name: "Định lý Pythagore. Các loại tứ giác thường gặp",
                            lessons: {
                                "1": { name: "Định lý Pythagore", types: { "1": "Định lý Pythagore", "2": "Định lý Pythagore đảo", "3": "Vận dụng định lý Pythagore", "4": "Bài toán thực tế" } },
                                "2": { name: "Tứ giác", types: { "1": "Tứ giác", "2": "Tổng các góc của một tứ giác", "3": "Bài toán thực tế" } },
                                "3": { name: "Hình thang, hình thang cân", types: { "1": "Hình thang, hình thang cân", "2": "Tính chất của hình thang cân", "3": "Dấu hiệu nhận biết hình thang cân", "4": "Bài toán thực tế" } },
                                "4": { name: "Hình bình hành - Hình thoi", types: { "1": "Hình bình hành", "2": "Hình thoi", "3": "Bài toán thực tế" } },
                                "5": { name: "Hình chữ nhật - Hình vuông", types: { "1": "Hình chữ nhật", "2": "Hình vuông", "3": "Bài toán thực tế" } }
                            }
                        },
                        "3": {
                            name: "Định lý Thalès",
                            lessons: {
                                "1": { name: "Định lý Thalès trong tam giác", types: { "1": "Đoạn thẳng tỉ lệ", "2": "Định lý Thalès trong tam giác", "3": "Bài toán thực tế" } },
                                "2": { name: "Đường trung bình của tam giác", types: { "1": "Đường trung bình của tam giác", "2": "Tính chất của đường trung bình", "3": "Bài toán thực tế" } },
                                "3": { name: "Tính chất đường phân giác của tam giác", types: { "1": "Tính chất đường phân giác", "2": "Áp dụng tính chia tỉ lệ của đường phân giác", "3": "Bài toán thực tế" } }
                            }
                        },
                        "4": {
                            name: "Hình đồng dạng",
                            lessons: {
                                "1": { name: "Hai tam giác đồng dạng", types: { "1": "Tam giác đồng dạng", "2": "Tính chất", "3": "Định lí", "4": "Bài toán thực tế" } },
                                "2": { name: "Các trường hợp đồng dạng của hai tam giác", types: { "1": "Trường hợp c.c.c (thứ nhất)", "2": "Trường hợp c.g.c (thứ hai)", "3": "Trường hợp g.g (thứ ba)", "4": "Bài toán thực tế" } },
                                "3": { name: "Các trường hợp đồng dạng của hai tam giác vuông", types: { "1": "Trường hợp góc nhọn tam giác vuông", "2": "Trường hợp 2 cạnh góc vuông", "3": "Trường hợp cạnh huyền - cạnh góc vuông", "4": "Bài toán thực tế" } },
                                "4": { name: "Hai hình đồng dạng", types: { "1": "Hình đồng dạng phối cảnh", "2": "Hai hình đồng dạng", "3": "Hình đồng dạng trong tự nhiên và đời sống" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 9 (Ký hiệu: 9)
        // =====================================================================
        "9": {
            gradeName: "Toán Lớp 9",
            code: "9",
            branches: {
                "D": {
                    name: "Đại số và Thống kê",
                    chapters: {
                        "1": {
                            name: "Phương trình và hệ phương trình",
                            lessons: {
                                "1": { name: "Phương trình quy về phương trình bậc nhất", types: { "1": "Phương trình tích", "2": "Phương trình chứa ẩn ở mẫu", "3": "Giải bài toán bằng cách lập phương trình" } },
                                "2": { name: "Phương trình bậc nhất 2 ẩn và hệ phương trình bậc nhất 2 ẩn", types: { "1": "Phương trình bậc nhất hai ẩn", "2": "Hệ phương trình bậc nhất hai ẩn", "3": "Bài Toán Thực Tế" } },
                                "3": { name: "Giải hệ phương trình bậc nhất 2 ẩn", types: { "1": "Giải hệ phương trình bằng phương pháp thế", "2": "Giải hệ phương trình bằng phương pháp cộng đại số", "3": "Tìm nghiệm bằng máy tính cầm tay", "4": "Giải bài toán bằng cách lập hệ phương trình" } }
                            }
                        },
                        "2": {
                            name: "Bất đẳng thức, bất phương trình bậc nhất một ẩn",
                            lessons: {
                                "1": { name: "Bất đẳng thức", types: { "1": "Khái niệm bất đẳng thức", "2": "Tính chất bất đẳng thức", "3": "Bài Toán Thực Tế" } },
                                "2": { name: "Bất phương trình bậc nhất một ẩn", types: { "1": "Bất phương trình bậc nhất một ẩn và nghiệm", "2": "Cách giải bất phương trình bậc nhất một ẩn", "3": "Bài Toán Thực Tế" } }
                            }
                        },
                        "3": {
                            name: "Căn thức",
                            lessons: {
                                "1": { name: "Căn bậc hai", types: { "1": "Căn bậc hai", "2": "Tính căn bậc hai bằng máy tính cầm tay", "3": "Căn thức bậc hai", "4": "Bài toán thực tế" } },
                                "2": { name: "Căn bậc ba", types: { "1": "Căn bậc ba của một số", "2": "Tính căn bậc ba bằng máy tính cầm tay", "3": "Căn thức bậc 3", "4": "Bài toán thực tế" } },
                                "3": { name: "Tính chất của phép khai phương", types: { "1": "Căn thức bậc hai của một bình phương", "2": "Căn thức bậc hai của một tích", "3": "Căn thức bậc hai của một thương", "4": "Bài toán thực tế" } },
                                "4": { name: "Biến đổi đơn giản biểu thức chứa căn bậc hai", types: { "1": "Trục căn thức ở mẫu", "2": "Rút gọn biểu thức chứa căn bậc hai", "3": "Bài toán thực tế" } }
                            }
                        },
                        "4": {
                            name: "Hàm số y = ax² (a ≠ 0) và Phương trình bậc hai một ẩn",
                            lessons: {
                                "1": { name: "Hàm số và đồ thị hàm số y = ax² (a ≠ 0)", types: { "1": "Hàm số y = ax²", "2": "Bảng giá trị của hàm số y = ax²", "3": "Đồ thị của hàm số y = ax²", "4": "Bài toán thực tế" } },
                                "2": { name: "Phương trình bậc 2 một ẩn", types: { "1": "Phương trình bậc hai một ẩn", "2": "Giải phương trình bằng cách đưa về phương trình tích", "3": "Công thức nghiệm của phương trình bậc 2", "4": "Tìm nghiệm bằng máy tính cầm tay", "5": "Giải bài toán bằng cách lập phương trình" } },
                                "3": { name: "Định lý Viète", types: { "1": "Định lí Viète", "2": "Tìm hai số khi biết tổng và tích của chúng", "3": "Bài toán thực tế" } }
                            }
                        },
                        "5": {
                            name: "Một số yếu tố thống kê",
                            lessons: {
                                "1": { name: "Bảng tần số và biểu đồ tần số", types: { "1": "Tần số và bảng tần số", "2": "Biểu đồ tần số" } },
                                "2": { name: "Bảng tần số tương đối và biểu đồ tần số tương đối", types: { "1": "Bảng tần số tương đối", "2": "Biểu đồ tần số tương đối" } },
                                "3": { name: "Biểu diễn số liệu ghép nhóm", types: { "1": "Bảng tần số ghép nhóm", "2": "Bảng tần số tương đối ghép nhóm", "3": "Biểu đồ tần số tương đối ghép nhóm" } }
                            }
                        },
                        "6": {
                            name: "Một số yếu tố xác suất",
                            lessons: {
                                "1": { name: "Không gian mẫu và biến cố", types: { "1": "Không gian mẫu", "2": "Biến cố" } },
                                "2": { name: "Xác suất của biến cố", types: { "1": "Kết quả đồng khả năng", "2": "Xác suất của biến cố" } },
                                "3": { name: "Biểu diễn số liệu ghép nhóm (Thống kê kết hợp)", types: { "1": "Bảng tần số ghép nhóm", "2": "Bảng tần số tương đối ghép nhóm", "3": "Biểu đồ tần số tương đối ghép nhóm" } }
                            }
                        },
                        "7": {
                            name: "Một số bài toán thực tế trong thi tuyển sinh",
                            lessons: {
                                "1": { name: "Các dạng bài toán thực tế", types: { "1": "Bài Toán Can Chi", "2": "Bài Toán tính ngày trong năm", "3": "Bài Toán tính múi giờ", "4": "Bài Toán tính chỉ số phép cộng trừ số nguyên", "5": "Bài Toán thiết lập đồ thị hàm bậc nhất", "6": "Bài Toán thiết lập đồ thị hàm bậc hai", "7": "Bài Toán ngân hàng, lãi suất", "8": "Bài Toán tối ưu (max min)" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học và Đo lường",
                    chapters: {
                        "1": {
                            name: "Hệ thức lượng trong tam giác vuông",
                            lessons: {
                                "1": { name: "Tỉ số lượng giác của góc nhọn", types: { "1": "Định nghĩa tỉ số lượng giác", "2": "Tỉ số lượng giác của hai góc phụ nhau", "3": "Tính tỉ số lượng giác bằng máy tính", "4": "Bài toán thực tế" } },
                                "2": { name: "Hệ thức giữa cạnh và góc của tam giác vuông", types: { "1": "Hệ thức giữa cạnh và góc", "2": "Giải tam giác vuông", "3": "Bài toán thực tế" } }
                            }
                        },
                        "2": {
                            name: "Đường tròn",
                            lessons: {
                                "1": { name: "Đường tròn", types: { "1": "Khái niệm đường tròn", "2": "Tính chất đối xứng của đường tròn", "3": "Đường kính và dây cung", "4": "Vị trí tương đối của hai đường tròn", "5": "Bài toán thực tế" } },
                                "2": { name: "Tiếp tuyến của đường tròn", types: { "1": "Vị trí tương đối của đường thẳng và đường tròn", "2": "Dấu hiệu nhận biết tiếp tuyến", "3": "Tính chất hai tiếp tuyến cắt nhau", "4": "Bài toán thực tế" } },
                                "3": { name: "Góc ở tâm, góc nội tiếp", types: { "1": "Góc ở tâm", "2": "Cung, số đo cung", "3": "Góc nội tiếp", "4": "Bài toán thực tế" } },
                                "4": { name: "Hình quạt tròn và hình vành khuyên", types: { "1": "Độ dài cung tròn", "2": "Hình quạt tròn", "3": "Hình vành khuyên", "4": "Bài toán thực tế" } }
                            }
                        },
                        "3": {
                            name: "Tứ giác nội tiếp. Đa giác đều",
                            lessons: {
                                "1": { name: "Đường tròn ngoại tiếp và nội tiếp tam giác", types: { "1": "Đường tròn ngoại tiếp tam giác", "2": "Đường tròn nội tiếp tam giác", "3": "Bài toán thực tế" } },
                                "2": { name: "Tứ giác nội tiếp", types: { "1": "Định nghĩa tứ giác nội tiếp", "2": "Tính chất tứ giác nội tiếp", "3": "Đường tròn ngoại tiếp hình chữ nhật, hình vuông", "4": "Bài toán thực tế" } },
                                "3": { name: "Đa giác đều và phép quay", types: { "1": "Khái niệm đa giác đều", "2": "Phép quay", "3": "Hình phẳng đều trong thực tế" } },
                                "4": { name: "Bài hình nhiều câu", types: { "1": "Kẻ hai tiếp tuyến từ 1 điểm đến (O)", "2": "Bài toán nửa đường tròn", "3": "Tam giác ABC có một cạnh là đường kính", "4": "Tam giác ABC nhọn nội tiếp (O)", "5": "Dựng thêm đường tròn thứ hai khác (O)", "6": "Kẻ 2 dây cung vuông góc", "7": "Bài toán max-min hình học", "8": "Bài toán khác" } },
                                "5": { name: "Bài hình liên quan các hình khác", types: { "1": "Kẻ 2 đường kính (hình chữ nhật)", "2": "Hình vuông", "3": "Tam giác đều", "4": "Tam giác cân", "5": "Tứ giác nội tiếp", "6": "Hình thang", "7": "Hình bình hành", "8": "Bài toán max-min" } },
                                "6": { name: "Bài hình liên quan tiếp tuyến chung", types: { "1": "Hai đường tròn tiếp xúc ngoài", "2": "Hai đường tròn tiếp xúc trong", "3": "Hai đường tròn ngoài nhau", "4": "Hai đường tròn đựng nhau", "5": "Hai đường tròn cắt nhau" } }
                            }
                        },
                        "4": {
                            name: "Các hình khối trong thực tiễn",
                            lessons: {
                                "1": { name: "Hình trụ", types: { "1": "Hình trụ", "2": "Diện tích xung quanh hình trụ", "3": "Thể tích của hình trụ", "4": "Bài toán thực tế" } },
                                "2": { name: "Hình nón", types: { "1": "Hình nón", "2": "Diện tích xung quanh của hình nón", "3": "Thể tích của hình nón", "4": "Bài toán thực tế" } },
                                "3": { name: "Hình cầu", types: { "1": "Hình cầu", "2": "Diện tích của mặt cầu", "3": "Thể tích của hình cầu", "4": "Bài toán thực tế" } },
                                "4": { name: "Các hình không gian kết hợp", types: { "1": "Hình trụ và hình nón", "2": "Hình trụ và hình cầu", "3": "Hình cầu và hình nón", "4": "Các hình khác (lăng trụ, hình hộp)" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 10 (Ký hiệu: 0)
        // =====================================================================
        "0": {
            gradeName: "Toán Lớp 10",
            code: "0",
            branches: {
                "D": {
                    name: "Đại số, Thống kê và Xác suất",
                    chapters: {
                        "1": {
                            name: "Mệnh đề và tập hợp",
                            lessons: {
                                "1": { name: "Mệnh đề", types: { "1": "Khái niệm mệnh đề, mệnh đề chứa biến", "2": "Mệnh đề phủ định", "3": "Mệnh đề kéo theo, mệnh đề đảo, tương đương", "4": "Kí hiệu với mọi, tồn tại" } },
                                "2": { name: "Tập hợp và các phép toán trên tập hợp", types: { "1": "Khái niệm tập hợp và các tập hợp số", "2": "Các phép toán trên tập hợp (Giao, hợp, hiệu)", "3": "Bài toán thực tế về tập hợp" } }
                            }
                        },
                        "2": {
                            name: "Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
                            lessons: {
                                "1": { name: "Bất phương trình bậc nhất hai ẩn", types: { "1": "Khái niệm bất phương trình bậc nhất hai ẩn", "2": "Biểu diễn miền nghiệm của BPT bậc nhất hai ẩn" } },
                                "2": { name: "Hệ bất phương trình bậc nhất hai ẩn", types: { "1": "Khái niệm hệ bất phương trình bậc nhất hai ẩn", "2": "Biểu diễn miền nghiệm của hệ BPT", "3": "Ứng dụng hệ BPT vào bài toán thực tế (Tìm GTLN, GTNN)" } }
                            }
                        },
                        "3": {
                            name: "Hàm số, đồ thị và ứng dụng",
                            lessons: {
                                "1": { name: "Hàm số và đồ thị", types: { "1": "Khái niệm hàm số, tập xác định", "2": "Đồ thị của hàm số và sự biến thiên" } },
                                "2": { name: "Hàm số bậc hai", types: { "1": "Khái niệm hàm số bậc hai và đồ thị", "2": "Sự biến thiên của hàm số bậc hai", "3": "Bài toán thực tế về hàm số bậc hai" } },
                                "3": { name: "Dấu của tam thức bậc hai", types: { "1": "Định lí về dấu của tam thức bậc hai", "2": "Giải bất phương trình bậc hai một ẩn", "3": "Ứng dụng giải phương trình quy về bậc hai" } }
                            }
                        },
                        "4": {
                            name: "Đại số tổ hợp",
                            lessons: {
                                "1": { name: "Quy tắc đếm", types: { "1": "Quy tắc cộng", "2": "Quy tắc nhân", "3": "Sơ đồ hình cây" } },
                                "2": { name: "Hoán vị, chỉnh hợp, tổ hợp", types: { "1": "Hoán vị", "2": "Chỉnh hợp", "3": "Tổ hợp", "4": "Ứng dụng vào bài toán đếm" } },
                                "3": { name: "Nhị thức Newton", types: { "1": "Khai triển nhị thức Newton (với n nhỏ)", "2": "Bài toán tìm hệ số trong khai triển" } }
                            }
                        },
                        "5": {
                            name: "Thống kê và xác suất",
                            lessons: {
                                "1": { name: "Các số đặc trưng đo xu thế trung tâm", types: { "1": "Số trung bình, trung vị, tứ phân vị", "2": "Mốt của mẫu số liệu" } },
                                "2": { name: "Các số đặc trưng đo mức độ phân tán", types: { "1": "Khoảng biến thiên, khoảng tứ phân vị", "2": "Phương sai và độ lệch chuẩn" } },
                                "3": { name: "Tính xác suất theo định nghĩa cổ điển", types: { "1": "Phép thử và biến cố", "2": "Tính xác suất của biến cố", "3": "Bài toán thực tế về xác suất" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học",
                    chapters: {
                        "1": {
                            name: "Hệ thức lượng trong tam giác",
                            lessons: {
                                "1": { name: "Giá trị lượng giác của một góc", types: { "1": "Giá trị lượng giác từ 0 đến 180 độ", "2": "Hệ thức lượng giác cơ bản" } },
                                "2": { name: "Hệ thức lượng trong tam giác", types: { "1": "Định lí côsin", "2": "Định lí sin", "3": "Các công thức tính diện tích tam giác", "4": "Giải tam giác và bài toán thực tế" } }
                            }
                        },
                        "2": {
                            name: "Vectơ",
                            lessons: {
                                "1": { name: "Khái niệm vectơ", types: { "1": "Định nghĩa vectơ, độ dài vectơ", "2": "Hai vectơ cùng phương, cùng hướng, bằng nhau" } },
                                "2": { name: "Tổng và hiệu của hai vectơ", types: { "1": "Tổng hai vectơ (Quy tắc ba điểm, hình bình hành)", "2": "Hiệu của hai vectơ" } },
                                "3": { name: "Tích của một số với một vectơ", types: { "1": "Khái niệm và tính chất", "2": "Điều kiện để hai vectơ cùng phương, thẳng hàng" } },
                                "4": { name: "Tích vô hướng của hai vectơ", types: { "1": "Góc giữa hai vectơ", "2": "Biểu thức và tính chất tích vô hướng" } }
                            }
                        },
                        "3": {
                            name: "Phương pháp tọa độ trong mặt phẳng",
                            lessons: {
                                "1": { name: "Tọa độ của vectơ và điểm", types: { "1": "Tọa độ của vectơ", "2": "Tọa độ của điểm và các công thức liên quan" } },
                                "2": { name: "Phương trình đường thẳng", types: { "1": "Vectơ chỉ phương, vectơ pháp tuyến", "2": "Phương trình tham số, phương trình tổng quát", "3": "Vị trí tương đối, góc và khoảng cách" } },
                                "3": { name: "Phương trình đường tròn", types: { "1": "Phương trình đường tròn", "2": "Phương trình tiếp tuyến của đường tròn" } },
                                "4": { name: "Ba đường conic", types: { "1": "Elip", "2": "Hypebol", "3": "Parabol" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 11 (Ký hiệu: 1)
        // =====================================================================
        "1": {
            gradeName: "Toán Lớp 11",
            code: "1",
            branches: {
                "D": {
                    name: "Đại số, Giải tích, Thống kê và Xác suất",
                    chapters: {
                        "1": {
                            name: "Hàm số lượng giác và phương trình lượng giác",
                            lessons: {
                                "1": { name: "Giá trị lượng giác của góc lượng giác", types: { "1": "Góc lượng giác, số đo góc lượng giác", "2": "Giá trị lượng giác của góc lượng giác", "3": "Quan hệ lượng giác của các góc đặc biệt" } },
                                "2": { name: "Công thức lượng giác", types: { "1": "Công thức cộng, công thức nhân đôi", "2": "Công thức biến đổi tích thành tổng, tổng thành tích" } },
                                "3": { name: "Hàm số lượng giác", types: { "1": "Tập xác định, tính chẵn lẻ, tuần hoàn", "2": "Đồ thị và sự biến thiên của hàm số lượng giác" } },
                                "4": { name: "Phương trình lượng giác cơ bản", types: { "1": "Giải phương trình lượng giác cơ bản", "2": "Điều kiện có nghiệm và bài toán thực tế" } }
                            }
                        },
                        "2": {
                            name: "Dãy số. Cấp số cộng và cấp số nhân",
                            lessons: {
                                "1": { name: "Dãy số", types: { "1": "Khái niệm, cách cho dãy số", "2": "Dãy số tăng, dãy số giảm và bị chặn" } },
                                "2": { name: "Cấp số cộng", types: { "1": "Định nghĩa, số hạng tổng quát", "2": "Tổng n số hạng đầu của cấp số cộng" } },
                                "3": { name: "Cấp số nhân", types: { "1": "Định nghĩa, số hạng tổng quát", "2": "Tổng n số hạng đầu của cấp số nhân" } }
                            }
                        },
                        "3": {
                            name: "Giới hạn. Hàm số liên tục",
                            lessons: {
                                "1": { name: "Giới hạn của dãy số", types: { "1": "Giới hạn hữu hạn của dãy số", "2": "Tổng của cấp số nhân lùi vô hạn" } },
                                "2": { name: "Giới hạn của hàm số", types: { "1": "Giới hạn tại một điểm", "2": "Giới hạn tại vô cực, giới hạn một bên" } },
                                "3": { name: "Hàm số liên tục", types: { "1": "Hàm số liên tục tại một điểm, trên một khoảng", "2": "Tính chất của hàm số liên tục, ứng dụng giải phương trình" } }
                            }
                        },
                        "4": {
                            name: "Hàm số mũ và hàm số lôgarit",
                            lessons: {
                                "1": { name: "Phép tính lũy thừa và lôgarit", types: { "1": "Lũy thừa với số mũ hữu tỉ, thực", "2": "Khái niệm và tính chất của lôgarit" } },
                                "2": { name: "Hàm số mũ và hàm số lôgarit", types: { "1": "Đồ thị và tính chất hàm số mũ", "2": "Đồ thị và tính chất hàm số lôgarit" } },
                                "3": { name: "Phương trình, bất phương trình mũ và lôgarit", types: { "1": "Giải phương trình mũ và lôgarit", "2": "Giải bất phương trình mũ và lôgarit" } }
                            }
                        },
                        "5": {
                            name: "Đạo hàm",
                            lessons: {
                                "1": { name: "Đạo hàm và các quy tắc tính", types: { "1": "Khái niệm đạo hàm, ý nghĩa hình học và vật lí", "2": "Các quy tắc tính đạo hàm, đạo hàm hàm hợp" } },
                                "2": { name: "Đạo hàm cấp hai", types: { "1": "Tính đạo hàm cấp hai, ứng dụng vật lí" } }
                            }
                        },
                        "6": {
                            name: "Thống kê và xác suất",
                            lessons: {
                                "1": { name: "Số đặc trưng mẫu số liệu ghép nhóm", types: { "1": "Trình bày mẫu số liệu ghép nhóm", "2": "Số trung bình, mốt, trung vị của mẫu ghép nhóm" } },
                                "2": { name: "Biến cố giao, biến cố hợp. Công thức nhân xác suất", types: { "1": "Phép toán trên các biến cố (giao, hợp)", "2": "Công thức cộng xác suất", "3": "Biến cố độc lập, công thức nhân xác suất" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học không gian",
                    chapters: {
                        "1": {
                            name: "Quan hệ song song trong không gian",
                            lessons: {
                                "1": { name: "Đường thẳng và mặt phẳng. Song song", types: { "1": "Khái niệm điểm, đường, mặt phẳng, giao tuyến", "2": "Hai đường thẳng chéo nhau, song song" } },
                                "2": { name: "Đường thẳng song song mặt phẳng", types: { "1": "Điều kiện, tính chất đường thẳng song song mặt phẳng" } },
                                "3": { name: "Hai mặt phẳng song song. Phép chiếu song song", types: { "1": "Điều kiện và tính chất hai mặt phẳng song song", "2": "Định lí Thales trong không gian, phép chiếu song song" } }
                            }
                        },
                        "2": {
                            name: "Quan hệ vuông góc trong không gian",
                            lessons: {
                                "1": { name: "Đường thẳng vuông góc", types: { "1": "Góc giữa hai đường thẳng trong không gian", "2": "Hai đường thẳng vuông góc" } },
                                "2": { name: "Đường thẳng vuông góc với mặt phẳng", types: { "1": "Điều kiện đường thẳng vuông góc mặt phẳng", "2": "Định lí ba đường vuông góc" } },
                                "3": { name: "Hai mặt phẳng vuông góc", types: { "1": "Góc nhị diện, góc giữa hai mặt phẳng", "2": "Điều kiện và tính chất hai mặt phẳng vuông góc" } },
                                "4": { name: "Khoảng cách. Góc", types: { "1": "Khoảng cách từ điểm đến đường, mặt phẳng", "2": "Khoảng cách giữa hai đường thẳng chéo nhau" } }
                            }
                        }
                    }
                }
            }
        },

        // =====================================================================
        // LỚP 12 (Ký hiệu: 2)
        // =====================================================================
        "2": {
            gradeName: "Toán Lớp 12",
            code: "2",
            branches: {
                "D": {
                    name: "Đại số, Giải tích, Thống kê và Xác suất",
                    chapters: {
                        "1": {
                            name: "Ứng dụng đạo hàm để khảo sát hàm số",
                            lessons: {
                                "1": { name: "Tính đơn điệu và cực trị của hàm số", types: { "1": "Xét tính đơn điệu của hàm số", "2": "Tìm cực trị của hàm số" } },
                                "2": { name: "Giá trị lớn nhất, nhỏ nhất và tiệm cận", types: { "1": "GTLN, GTNN của hàm số trên một đoạn/khoảng", "2": "Đường tiệm cận đứng, ngang, xiên" } },
                                "3": { name: "Khảo sát và vẽ đồ thị hàm số", types: { "1": "Khảo sát hàm số đa thức bậc ba", "2": "Khảo sát hàm phân thức bậc nhất/bậc nhất, bậc hai/bậc nhất" } }
                            }
                        },
                        "2": {
                            name: "Nguyên hàm và tích phân",
                            lessons: {
                                "1": { name: "Nguyên hàm", types: { "1": "Khái niệm, tính chất cơ bản của nguyên hàm", "2": "Các phương pháp tìm nguyên hàm (đổi biến, từng phần)" } },
                                "2": { name: "Tích phân và ứng dụng", types: { "1": "Định nghĩa và tính chất của tích phân", "2": "Tính diện tích hình phẳng, thể tích vật thể bằng tích phân" } }
                            }
                        },
                        "3": {
                            name: "Thống kê và xác suất",
                            lessons: {
                                "1": { name: "Các số đặc trưng đo mức độ phân tán (mẫu ghép nhóm)", types: { "1": "Khoảng biến thiên, khoảng tứ phân vị mẫu ghép nhóm", "2": "Phương sai và độ lệch chuẩn mẫu ghép nhóm" } },
                                "2": { name: "Xác suất có điều kiện. Công thức xác suất toàn phần", types: { "1": "Tính xác suất có điều kiện", "2": "Công thức xác suất toàn phần và công thức Bayes" } }
                            }
                        }
                    }
                },
                "H": {
                    name: "Hình học và Tọa độ trong không gian",
                    chapters: {
                        "1": {
                            name: "Vectơ và hệ tọa độ trong không gian",
                            lessons: {
                                "1": { name: "Vectơ trong không gian", types: { "1": "Các phép toán vectơ trong không gian", "2": "Sự đồng phẳng của ba vectơ" } },
                                "2": { name: "Tọa độ của vectơ và điểm", types: { "1": "Hệ trục tọa độ Oxyz, biểu thức tọa độ của phép toán vectơ", "2": "Tích vô hướng, góc và khoảng cách giữa hai điểm" } }
                            }
                        },
                        "2": {
                            name: "Phương pháp tọa độ trong không gian",
                            lessons: {
                                "1": { name: "Phương trình mặt phẳng", types: { "1": "Vectơ pháp tuyến, lập phương trình mặt phẳng", "2": "Khoảng cách từ một điểm đến mặt phẳng" } },
                                "2": { name: "Phương trình đường thẳng", types: { "1": "Vectơ chỉ phương, lập phương trình tham số, chính tắc", "2": "Vị trí tương đối và góc" } },
                                "3": { name: "Phương trình mặt cầu", types: { "1": "Lập phương trình mặt cầu, xác định tâm và bán kính", "2": "Sự tương giao giữa mặt cầu và đường thẳng, mặt phẳng" } }
                            }
                        }
                    }
                }
            }
        }
    };

    // =========================================================================
    // HELPER FUNCTIONS & PARSER
    // =========================================================================

    const LEVEL_MAP = {
        'N': 'Nhận biết',
        'H': 'Thông hiểu',
        'V': 'Vận dụng',
        'C': 'Vận dụng cao'
    };

    const REVERSE_LEVEL_MAP = {
        'Nhận biết': 'N',
        'Thông hiểu': 'H',
        'Vận dụng': 'V',
        'Vận dụng cao': 'C',
        'nhận biết': 'N',
        'thông hiểu': 'H',
        'vận dụng': 'V',
        'vận dụng cao': 'C'
    };

    const GRADE_CODE_TO_NAME = {
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '10',
        '1': '11',
        '2': '12'
    };

    const GRADE_NAME_TO_CODE = {
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '0',
        '11': '1',
        '12': '2'
    };

    /**
     * Parse raw ID code like "[2D1N1-1]" or "2D1H2-1" or "0H3V2-3"
     */
    function parseMathId(idString) {
        if (!idString || typeof idString !== 'string') return null;
        let clean = idString.trim().replace(/^\[|\]$/g, '').toUpperCase();
        // Pattern: [GradeCode][Branch][Chapter][Level][Lesson]-[Type]
        let match = clean.match(/^([6789012])([DH])(\d)([NHVC\?])([1-9A-C])-(\d+)$/i);
        if (!match) return null;

        let [, gCode, branch, ch, lvl, ls, tp] = match;
        let gradeNum = GRADE_CODE_TO_NAME[gCode] || gCode;
        let gradeData = MATH_ID_TAXONOMY[gCode];
        if (!gradeData) return null;

        let branchData = gradeData.branches ? gradeData.branches[branch] : null;
        let chapterData = branchData?.chapters ? branchData.chapters[ch] : null;
        let lessonData = chapterData?.lessons ? chapterData.lessons[ls] : null;
        let typeName = lessonData?.types ? (lessonData.types[tp] || `Dạng ${tp}`) : `Dạng ${tp}`;

        let levelName = LEVEL_MAP[lvl] || (lvl === '?' ? 'Tùy chọn mức độ' : 'Nhận biết');

        return {
            valid: true,
            raw: `[${clean}]`,
            code: clean,
            gradeCode: gCode,
            grade: gradeNum,
            gradeName: gradeData.gradeName || gradeData.name || `Khối ${gradeNum}`,
            branch: branch,
            branchName: branchData ? branchData.name : (branch === 'D' ? 'Đại số / Giải tích' : 'Hình học'),
            chapter: ch,
            chapterName: chapterData ? chapterData.name : `Chương ${ch}`,
            levelCode: lvl,
            level: levelName,
            lesson: ls,
            lessonName: lessonData ? lessonData.name : `Bài ${ls}`,
            type: tp,
            typeName: typeName,
            fullTitle: `[${clean}] ${gradeData.gradeName || gradeData.name || ''} - ${chapterData?.name || ''} - ${lessonData?.name || ''} (${typeName})`
        };
    }

    function stripAccents(str) {
        if (!str || typeof str !== 'string') return '';
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .toLowerCase();
    }

    /**
     * Search across taxonomy by query string (ID or keyword, with accent-insensitive matching)
     */
    function searchMathId(query, targetGrade = null) {
        if (!query || !query.trim()) return [];
        let q = query.trim().toLowerCase();
        let qNoAccent = stripAccents(q);
        let results = [];

        let gradesToSearch = targetGrade ? [GRADE_NAME_TO_CODE[String(targetGrade)] || String(targetGrade)] : Object.keys(MATH_ID_TAXONOMY);

        gradesToSearch.forEach(gCode => {
            let gData = MATH_ID_TAXONOMY[gCode];
            if (!gData) return;
            let gNum = GRADE_CODE_TO_NAME[gCode];

            Object.keys(gData.branches).forEach(bKey => {
                let bData = gData.branches[bKey];
                Object.keys(bData.chapters).forEach(cKey => {
                    let cData = bData.chapters[cKey];
                    Object.keys(cData.lessons).forEach(lKey => {
                        let lData = cData.lessons[lKey];
                        Object.keys(lData.types).forEach(tKey => {
                            let tName = lData.types[tKey];
                            let idTemplate = `${gCode}${bKey}${cKey}?${lKey}-${tKey}`;
                            let fullStr = `${idTemplate} ${gData.gradeName || ''} ${bData.name || ''} ${cData.name || ''} ${lData.name || ''} ${tName}`.toLowerCase();
                            let fullStrNoAccent = stripAccents(fullStr);

                            if (fullStr.includes(q) || fullStrNoAccent.includes(qNoAccent)) {
                                results.push({
                                    idTemplate: `[${idTemplate}]`,
                                    grade: gNum,
                                    gradeCode: gCode,
                                    branch: bKey,
                                    branchName: bData.name,
                                    chapterName: cData.name,
                                    lessonName: lData.name,
                                    typeName: tName,
                                    fullTitle: `[${idTemplate}] ${gData.gradeName || ''} - ${cData.name} - ${lData.name} (${tName})`
                                });
                            }
                        });
                    });
                });
            });
        });

        return results.slice(0, 30);
    }

    /**
     * Format an ID string into a stylized HTML badge
     */
    function formatMathIdBadge(idString) {
        let parsed = parseMathId(idString);
        if (!parsed) return `<span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded border border-slate-300">${idString || 'NO_ID'}</span>`;

        let colorClass = 'bg-sky-50 text-sky-700 border-sky-300';
        if (parsed.levelCode === 'H') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-300';
        if (parsed.levelCode === 'V') colorClass = 'bg-amber-50 text-amber-700 border-amber-300';
        if (parsed.levelCode === 'C') colorClass = 'bg-rose-50 text-rose-700 border-rose-300';

        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${colorClass} font-mono text-[11px] font-black shadow-2xs tracking-wider" title="${parsed.fullTitle}">
            <i class="fa-solid fa-tag text-[9px] opacity-70"></i> ${parsed.code}
        </span>`;
    }

    /**
     * UI Modal Management for Math ID Picker
     */
    let currentMathIdCallback = null;
    let currentMathIdGrade = '12';

    function openMathIdPickerModal(callback, initialGrade = '12') {
        currentMathIdCallback = callback;
        currentMathIdGrade = String(initialGrade || '12');
        let modal = document.getElementById('math-id-picker-modal');
        if (!modal) return;
        modal.classList.remove('hidden');

        let searchInput = document.getElementById('math-id-search-input');
        if (searchInput) searchInput.value = '';

        switchMathIdGradeTab(currentMathIdGrade);
    }

    function closeMathIdPickerModal() {
        let modal = document.getElementById('math-id-picker-modal');
        if (modal) modal.classList.add('hidden');
        currentMathIdCallback = null;
    }

    function switchMathIdGradeTab(grade) {
        currentMathIdGrade = String(grade);
        
        let tabBtns = document.querySelectorAll('.math-id-tab-btn');
        tabBtns.forEach(btn => {
            let g = btn.getAttribute('data-grade');
            if (g === currentMathIdGrade) {
                btn.className = "math-id-tab-btn px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-black transition shadow-xs";
            } else {
                btn.className = "math-id-tab-btn px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition";
            }
        });

        renderMathIdTreeList();
    }

    function onMathIdSearchInput(query) {
        if (!query || !query.trim()) {
            renderMathIdTreeList();
            return;
        }

        let results = searchMathId(query, currentMathIdGrade);
        let container = document.getElementById('math-id-tree-container');
        if (!container) return;

        let levelSelect = document.getElementById('math-id-picker-level');
        let curLevel = levelSelect ? levelSelect.value : 'H';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-400">
                    <i class="fa-solid fa-magnifying-glass text-4xl mb-3 text-slate-300"></i>
                    <p class="text-sm font-bold">Không tìm thấy mã ID hoặc dạng toán phù hợp!</p>
                    <p class="text-xs mt-1">Thử gõ mã viết tắt như "2D1", "0H2" hoặc từ khóa "đạo hàm", "tích phân"...</p>
                </div>
            `;
            return;
        }

        let html = `<div class="space-y-2">`;
        html += `<div class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Kết quả tìm kiếm (${results.length} dạng bài):</div>`;

        results.forEach(item => {
            let actualId = item.idTemplate.replace('?', curLevel);
            html += `
                <div onclick="selectMathIdItem('${actualId}', '${item.chapterName} - ${item.lessonName} (${item.typeName})', '${curLevel}')" class="p-3 bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 group shadow-xs">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-xl font-mono text-xs font-black shrink-0 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition">${actualId}</span>
                        <div class="min-w-0">
                            <div class="text-xs font-black text-slate-800 truncate">${item.typeName}</div>
                            <div class="text-[11px] text-slate-500 font-medium truncate">${item.chapterName} &bull; ${item.lessonName}</div>
                        </div>
                    </div>
                    <button class="px-3 py-1 bg-slate-100 group-hover:bg-sky-600 group-hover:text-white text-slate-600 rounded-lg text-xs font-bold shrink-0 transition">
                        Chọn &rarr;
                    </button>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
    }

    function renderMathIdTreeList() {
        let container = document.getElementById('math-id-tree-container');
        if (!container) return;

        let gCode = GRADE_NAME_TO_CODE[currentMathIdGrade] || currentMathIdGrade;
        let gData = MATH_ID_TAXONOMY[gCode];
        if (!gData) {
            container.innerHTML = `<div class="text-center py-8 text-slate-400 font-bold">Chưa có dữ liệu cho khối lớp này!</div>`;
            return;
        }

        let levelSelect = document.getElementById('math-id-picker-level');
        let curLevel = levelSelect ? levelSelect.value : 'H';

        let html = `<div class="space-y-6">`;

        Object.keys(gData.branches).forEach(bKey => {
            let bData = gData.branches[bKey];
            html += `
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 class="text-sm font-black text-indigo-900 uppercase tracking-wide mb-4 flex items-center gap-2 pb-2 border-b border-indigo-100">
                        <i class="fa-solid fa-bookmark text-indigo-600"></i> ${bData.name} (Ký hiệu: ${bKey})
                    </h4>
                    <div class="space-y-4">
            `;

            Object.keys(bData.chapters).forEach(cKey => {
                let cData = bData.chapters[cKey];
                let chPrefix = `${gCode}${bKey}${cKey}`;
                html += `
                    <div class="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                        <div class="flex items-center justify-between mb-3">
                            <span class="font-black text-xs text-sky-900 uppercase flex items-center gap-1.5">
                                <span class="px-2 py-0.5 bg-sky-200 text-sky-800 rounded font-mono text-[10px] font-black">${chPrefix}</span>
                                ${cData.name}
                            </span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                `;

                Object.keys(cData.lessons).forEach(lKey => {
                    let lData = cData.lessons[lKey];
                    let lsPrefix = `${chPrefix}?${lKey}`;
                    html += `
                        <div class="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                            <div class="text-xs font-black text-slate-800 mb-2 flex items-center gap-1">
                                <span class="text-slate-400 font-mono text-[10px]">[Bài ${lKey}]</span> ${lData.name}
                            </div>
                            <div class="space-y-1">
                    `;

                    Object.keys(lData.types).forEach(tKey => {
                        let tName = lData.types[tKey];
                        let finalId = `[${chPrefix}${curLevel}${lKey}-${tKey}]`;
                        html += `
                            <div onclick="selectMathIdItem('${finalId}', '${cData.name} - ${lData.name} (${tName})', '${curLevel}')" class="p-1.5 px-2 hover:bg-sky-50 rounded-lg cursor-pointer transition flex items-center justify-between text-[11px] group border border-transparent hover:border-sky-200">
                                <span class="font-medium text-slate-700 group-hover:text-sky-900 group-hover:font-bold truncate mr-2">&bull; ${tName}</span>
                                <span class="font-mono text-[10px] font-black text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 shrink-0 group-hover:bg-sky-600 group-hover:text-white transition">${finalId}</span>
                            </div>
                        `;
                    });

                    html += `
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    function selectMathIdItem(idCode, topicName, levelCode) {
        if (typeof currentMathIdCallback === 'function') {
            currentMathIdCallback({
                idCode: idCode,
                topic: topicName,
                levelCode: levelCode,
                level: LEVEL_MAP[levelCode] || 'Thông hiểu'
            });
        }
        closeMathIdPickerModal();
    }

    // Expose globally
    window.MATH_ID_TAXONOMY = MATH_ID_TAXONOMY;
    window.parseMathId = parseMathId;
    window.searchMathId = searchMathId;
    window.formatMathIdBadge = formatMathIdBadge;
    window.REVERSE_LEVEL_MAP = REVERSE_LEVEL_MAP;
    window.LEVEL_MAP = LEVEL_MAP;
    window.GRADE_CODE_TO_NAME = GRADE_CODE_TO_NAME;
    window.GRADE_NAME_TO_CODE = GRADE_NAME_TO_CODE;
    window.openMathIdPickerModal = openMathIdPickerModal;
    window.closeMathIdPickerModal = closeMathIdPickerModal;
    window.switchMathIdGradeTab = switchMathIdGradeTab;
    window.renderMathIdTreeList = renderMathIdTreeList;
    window.onMathIdSearchInput = onMathIdSearchInput;
    window.selectMathIdItem = selectMathIdItem;

})(window);
