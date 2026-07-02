"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = exports.createContact = void 0;
const db_1 = require("../db");
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const contact = yield db_1.db.contact.create({
            data,
        });
        res.status(201).json(contact);
    }
    catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createContact = createContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        let whereClause = {};
        if (search && typeof search === 'string') {
            whereClause = {
                OR: [
                    { fullName: { contains: search } },
                    { schoolName: { contains: search } }
                ]
            };
        }
        const contacts = yield db_1.db.contact.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(contacts);
    }
    catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getContacts = getContacts;
