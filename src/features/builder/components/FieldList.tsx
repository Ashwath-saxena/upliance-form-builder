// src/features/builder/components/FieldList.tsx
import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { FieldType } from "../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { addField, deleteField, moveField, selectField } from "../builderSlice";

const typeLabel: Record<FieldType, string> = {
  text: "Text",
  number: "Number",
  textarea: "Textarea",
  select: "Select",
  radio: "Radio",
  checkbox: "Checkbox",
  date: "Date",
};

function useFields() {
  return useSelector((s: RootState) => s.builder.fields);
}

function useSelectedId() {
  return useSelector((s: RootState) => s.builder.selectedFieldId);
}

export function FieldList() {
  const fields = useFields();
  const selectedId = useSelectedId();
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return fields;
  }, [fields]);

  const onAdd = (type: FieldType) => dispatch(addField(type));

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1">Fields</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <AddMenu onAdd={onAdd} />
      </Stack>
      {sorted.length === 0 ? (
        <Box sx={{ py: 3 }}>
          <Typography color="text.secondary">
            No fields yet. Click “Add Field” to get started.
          </Typography>
        </Box>
      ) : (
        <List dense>
          {sorted.map((f, idx) => {
            const isDerived = Boolean(f.derived?.isDerived);
            const isRequired = Boolean(f.validations?.required || f.required);
            return (
              <Fragment key={f.id}>
                <ListItemButton
                  selected={selectedId === f.id}
                  onClick={() => dispatch(selectField(f.id))}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={600}>
                          {f.label || "(no label)"}
                        </Typography>
                        <Chip
                          size="small"
                          label={typeLabel[f.type]}
                          variant="outlined"
                        />
                        {isRequired && (
                          <Chip
                            size="small"
                            label="Required"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {isDerived && (
                          <Chip
                            size="small"
                            label="Derived"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    }
                    secondary={f.id}
                  />
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Move up">
                      <span>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(moveField({ id: f.id, direction: "up" }));
                          }}
                          disabled={idx === 0}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move down">
                      <span>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              moveField({ id: f.id, direction: "down" })
                            );
                          }}
                          disabled={idx === sorted.length - 1}
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(f.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItemButton>
              </Fragment>
            );
          })}
        </List>
      )}

      <ConfirmDeleteDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            dispatch(deleteField(deleteId));
            setDeleteId(null);
          }
        }}
      />
    </Stack>
  );
}

function AddMenu({ onAdd }: { onAdd: (t: FieldType) => void }) {
  const addButtons: { label: string; type: FieldType }[] = [
    { label: "Text", type: "text" },
    { label: "Number", type: "number" },
    { label: "Textarea", type: "textarea" },
    { label: "Select", type: "select" },
    { label: "Radio", type: "radio" },
    { label: "Checkbox", type: "checkbox" },
    { label: "Date", type: "date" },
  ];
  return (
    <Stack
      spacing={{ xs: 1, sm: 1 }}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap" }}
    >
      {addButtons.map((b) => (
        <Button
          key={b.type}
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onAdd(b.type)}
        >
          {b.label}
        </Button>
      ))}
    </Stack>
  );
}

function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete field</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove the field from the form. If other fields derive from
          it, deletion will be blocked.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
