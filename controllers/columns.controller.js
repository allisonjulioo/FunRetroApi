const column_db = require("../migration/columns.js");
const board_db = require("../migration/board.js");
const card_db = require("../migration/cards.js");
const user_db = require("../migration/user.js");
const express = require("express");

const getUser = async (user_id) => {
  const sql = "select * from user where id_user = ?";
  const params = [user_id];
  const response = await new Promise((resolve) => {
    user_db.get(sql, params, (err, user) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (user) {
        resolve(user);
      }
    });
  });

  return await response;
};

const getCards = async (board_id, column_id) => {
  const sql = "SELECT * FROM card WHERE board_id LIKE ? AND column_id LIKE ?;";
  const params = [board_id, column_id];

  let response = await new Promise((resolve) => {
    card_db.all(sql, params, (err, cards) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      if (cards) {
        cards = cards.map(async (card) => ({
          ...card,
          user: await getUser(card.user_id),
        }));
        resolve(cards);
      }
    });
  });
  response = await Promise.all(response);

  return response;
};

const getColumns = async (user_id, board_id) => {
  const sql = "SELECT * FROM column WHERE user_id LIKE ? AND board_id LIKE ?;";

  const params = [user_id, board_id];

  const response = await new Promise((resolve) => {
    column_db.all(sql, params, (err, columns) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (columns) {
        columns = columns.map(async (column) => ({
          ...column,
          cards: await getCards(board_id, column.column_id),
        }));
        resolve(columns);
      }
    });
  });

  return await response;
};

exports.GetColumns = (req, res, next) => {
  const sql = "SELECT * FROM board WHERE user_id = ?;";
  const params = [req.params.user_id];

  return board_db.get(sql, params, async (err, board) => {
    if (board) {
      let columns = await getColumns(req.params.user_id, board.board_id);
      columns = await Promise.all(columns);

      await res.json({
        message: "success",
        total: columns.length,
        columns,
        board,
      });
    } else res.json({ error: "No find columns by id:" + params[0] });
  });
};

exports.CreateColumn = (req, res, next) => {
  const errors = [];
  if (!req.body.title) {
    errors.push("No title specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  let data = {
    title: req.body.title,
    color: req.body.color,
    user_id: req.params.user_id,
    board_id: req.params.board_id,
  };
  const sql = `INSERT INTO column (title, color, user_id, board_id) VALUES (?,?,?,?)`;
  const params = [data.title, data.color, data.user_id, data.board_id];
  column_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
    });
  });
};
// Update user
exports.UpdateColumn = (req, res, next) => {
  let data = {
    title: req.body.title,
    color: req.body.color,
  };
  column_db.run(
    `UPDATE column set
        title = COALESCE(?,title),
        color = COALESCE(?,color)
        WHERE column_id = ?`,
    [data.title, data.color, req.params.column_id],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: "Coluna atualizada",
        data: data,
        changes: this.changes,
      });
    }
  );
};
// Delete user
exports.DeleteColumn = (req, res, next) => {
  column_db.run(
    "DELETE FROM column WHERE column_id = ?",
    req.params.column_id,
    (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ deleted: "ok", changes: result });
    }
  );
};
