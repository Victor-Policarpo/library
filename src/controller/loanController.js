import { createLoanDatabase, getLoansDatabase, getLoanByIdDatabase, updateLoanDatabase, deleteLoanDatabase } from "../repository/loanRepository.js";

export const createLoan = async (req, res) => {
    try {
        const { userId, bookId, loanDate } = req.body;
        if (!userId || !bookId || !loanDate) {
            return res.status(400).json({ message: "userId, bookId, and loanDate are required" });
        }
        const loan = await createLoanDatabase(userId, bookId, loanDate);
        res.status(201).json(loan);

    } catch (error){
        return res.status(500).json({
            message: "Error creating loan",
            error: error.message
        });
    }
}

export const getLoans = async (req, res) => {
    try {
        const loans = await getLoansDatabase();
        const formattedLoans = loans.map(loan => ({
            id: loan.id,
            loanDate: loan.loan_date.toISOString().split("T")[0],
            returnDate: loan.return_date
                ? loan.return_date.toISOString().split("T")[0]
                : null,
            user: {
                id: loan.user_id,
                name: loan.user_name
            },
            book: {
                id: loan.book_id,
                title: loan.book_title
            }
        }));

        return res.status(200).json(formattedLoans);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching loans",
            error: error.message
        });
    }
};

export const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            });
        }

        const loan = await getLoanByIdDatabase(id);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const formattedLoan = {
            id: loan.id,
            loanDate: loan.loan_date.toISOString().split("T")[0],
            returnDate: loan.return_date
                ? loan.return_date.toISOString().split("T")[0]
                : null,
            user: {
                id: loan.user_id,
                name: loan.user_name
            },
            book: {
                id: loan.book_id,
                title: loan.book_title
            }
        };

        return res.status(200).json(formattedLoan);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching loan",
            error: error.message
        });
    }
};

export const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            });
        }

        const { returnDate } = req.body;
        if (!returnDate) {
            return res.status(400).json({
                message: "Return date is required"
            });
        }

        const loan = await getLoanByIdDatabase(id);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        await updateLoanDatabase(id, returnDate);
        return res.status(200).json({
            message: "Loan updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating loan",
            error: error.message
        });
    }
};

export const deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            });
        }

        const loan = await getLoanByIdDatabase(id);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        await deleteLoanDatabase(id);
        return res.status(200).json({
            message: "Loan deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting loan",
            error: error.message
        });
    }
};
