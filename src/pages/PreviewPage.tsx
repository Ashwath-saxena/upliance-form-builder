// // src/pages/PreviewPage.tsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   Alert,
//   Button,
//   Paper,
//   Stack,
//   Typography,
//   Fade,
//   Box,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../app/store";
// import {
//   loadFromSchema,
//   setValue,
//   validateAll,
//   submitForm,
// } from "../features/preview/previewSlice";
// import { FormFieldRenderer } from "../components/common/FormFieldRenderer";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { loadFormById } from "../utils/storage";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import SendIcon from "@mui/icons-material/Send";

// export function PreviewPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const formId = searchParams.get("id");

//   const builderFields = useSelector((s: RootState) => s.builder.fields);
//   const formName = useSelector((s: RootState) => s.builder.formName);
//   const preview = useSelector((s: RootState) => s.preview);

//   const [validationMessage, setValidationMessage] = useState<{
//     show: boolean;
//     type: "success" | "error";
//     message: string;
//   }>({ show: false, type: "success", message: "" });

//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const currentSchema = useMemo(() => {
//     if (formId) {
//       const saved = loadFormById(formId);
//       return saved;
//     }

//     if (builderFields.length === 0) return null;
//     return {
//       id: "builder_preview",
//       name: formName || "Form Preview",
//       createdAt: new Date().toISOString(),
//       fields: builderFields,
//     };
//   }, [builderFields, formName, formId]);

//   useEffect(() => {
//     if (currentSchema) {
//       dispatch(loadFromSchema(currentSchema));
//       setSubmitSuccess(false);
//     }
//   }, [dispatch, currentSchema]);

//   useEffect(() => {
//     const checkValidationErrors = () => {
//       if (!currentSchema) return { hasErrors: false, errorFieldNames: [] };

//       let hasErrors = false;
//       const errorFieldNames: string[] = [];

//       console.log("=== CHECKING VALIDATION RESULTS ===");
//       console.log("Current preview.errors:", preview.errors);
//       console.log("Current preview.derivedErrors:", preview.derivedErrors);

//       Object.entries(preview.errors).forEach(([fieldId, error]) => {
//         console.log(`Field error: ${fieldId} - ${error}`);
//         if (error !== null && error !== "") {
//           hasErrors = true;
//           const field = currentSchema.fields.find((f) => f.id === fieldId);
//           errorFieldNames.push(field?.label || fieldId);
//         }
//       });

//       Object.entries(preview.derivedErrors).forEach(([fieldId, error]) => {
//         console.log(`Derived field error: ${fieldId} - ${error}`);
//         if (error !== null && error !== "") {
//           hasErrors = true;
//           const field = currentSchema.fields.find((f) => f.id === fieldId);
//           errorFieldNames.push(field?.label || fieldId);
//         }
//       });

//       console.log("Total errors found:", errorFieldNames.length);
//       return { hasErrors, errorFieldNames };
//     };

//     if (preview.submitAttempted) {
//       const validation = checkValidationErrors();

//       if (!validation.hasErrors) {
//         setValidationMessage({
//           show: true,
//           type: "success",
//           message: `✅ All fields are valid! Form has ${
//             currentSchema?.fields.length || 0
//           } fields.`,
//         });
//         setSubmitSuccess(true);
//       } else {
//         setValidationMessage({
//           show: true,
//           type: "error",
//           message: `❌ Found ${
//             validation.errorFieldNames.length
//           } validation error${
//             validation.errorFieldNames.length > 1 ? "s" : ""
//           } in: ${validation.errorFieldNames.join(", ")}`,
//         });
//         setSubmitSuccess(false);
//       }

//       setTimeout(() => {
//         setValidationMessage((prev) => ({ ...prev, show: false }));
//       }, 5000);
//     }
//   }, [
//     preview.errors,
//     preview.derivedErrors,
//     preview.submitAttempted,
//     currentSchema,
//   ]);
//   const handleValidateAll = () => {
//     console.log("=== VALIDATE ALL CLICKED ===");

//     if (!currentSchema) {
//       console.log("No schema available for validation");
//       return;
//     }

//     dispatch(validateAll());
//   };

//   const handleSubmit = () => {
//     console.log("=== FORM SUBMIT CLICKED ===");

//     if (!currentSchema) {
//       console.log("No schema available for submission");
//       return;
//     }

//     dispatch(submitForm());
//   };

//   const hasFields =
//     builderFields.length > 0 || (currentSchema?.fields.length || 0) > 0;

//   return (
//     <Stack spacing={3}>
//       {/* Header Section */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         alignItems={{ xs: "stretch", sm: "center" }}
//         justifyContent="space-between"
//       >
//         <Typography variant="h5">Form Preview</Typography>
//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="outlined"
//             onClick={handleValidateAll}
//             color="primary"
//           >
//             Validate All
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => navigate(formId ? "/myforms" : "/create")}
//           >
//             {formId ? "Back to My Forms" : "Back to Builder"}
//           </Button>
//         </Stack>
//       </Stack>

//       {/* Validation Message Alert */}
//       {validationMessage.show && (
//         <Fade in timeout={300}>
//           <Alert
//             severity={validationMessage.type}
//             onClose={() =>
//               setValidationMessage({ ...validationMessage, show: false })
//             }
//             sx={{ mb: 2 }}
//           >
//             {validationMessage.message}
//           </Alert>
//         </Fade>
//       )}

//       {/* Submit Success Message */}
//       {submitSuccess && (
//         <Fade in timeout={500}>
//           <Box
//             sx={{
//               p: 3,
//               textAlign: "center",
//               backgroundColor: "success.light",
//               borderRadius: 2,
//               border: "2px solid",
//               borderColor: "success.main",
//             }}
//           >
//             <CheckCircleIcon
//               sx={{ fontSize: 48, color: "success.main", mb: 2 }}
//             />
//             <Typography variant="h6" color="success.dark">
//               Form Submitted Successfully!
//             </Typography>
//             <Typography variant="body2" color="success.dark">
//               All form data has been validated and processed.
//             </Typography>
//           </Box>
//         </Fade>
//       )}

//       {/* No Fields State */}
//       {!hasFields && (
//         <Paper variant="outlined" sx={{ p: 3 }}>
//           <Alert severity="info">
//             No form fields to preview. Please add fields in the Form Builder
//             first.
//           </Alert>
//         </Paper>
//       )}

//       {/* Form Fields Rendering */}
//       {hasFields && currentSchema && (
//         <Paper variant="outlined" sx={{ p: 3 }}>
//           <Typography variant="h6" sx={{ mb: 3 }}>
//             {currentSchema.name}
//           </Typography>

//           {/* Form Fields Grid */}
//           <Grid container spacing={2}>
//             {currentSchema.fields.map((f) => (
//               <Grid key={f.id} size={{ xs: 12, md: 6 }}>
//                 <FormFieldRenderer
//                   field={f}
//                   value={preview.values[f.id]}
//                   error={preview.errors[f.id]}
//                   derivedError={preview.derivedErrors[f.id]}
//                   onChange={(id, value) => dispatch(setValue({ id, value }))}
//                 />
//               </Grid>
//             ))}
//           </Grid>

//           {/* SUBMIT BUTTON */}
//           <Box
//             sx={{
//               mt: 4,
//               pt: 3,
//               borderTop: "1px solid",
//               borderColor: "divider",
//               textAlign: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               size="large"
//               startIcon={<SendIcon />}
//               onClick={handleSubmit}
//               disabled={submitSuccess}
//               sx={{
//                 minWidth: 200,
//                 py: 1.5,
//                 fontSize: "1.1rem",
//                 fontWeight: 600,
//                 background: submitSuccess
//                   ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
//                   : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
//                 "&:hover": {
//                   background: submitSuccess
//                     ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
//                     : "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
//                 },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               {submitSuccess ? "Submitted!" : "Submit Form"}
//             </Button>
//           </Box>
//         </Paper>
//       )}
//     </Stack>
//   );
// }



// src/pages/PreviewPage.tsx - FIXED VERSION with Submit button for both scenarios
import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Paper, Stack, Typography, Fade, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import { loadFromSchema, setValue, validateAll, submitForm } from '../features/preview/previewSlice'
import { FormFieldRenderer } from '../components/common/FormFieldRenderer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadFormById } from '../utils/storage'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'

export function PreviewPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('id')
  
  const builderFields = useSelector((s: RootState) => s.builder.fields)
  const formName = useSelector((s: RootState) => s.builder.formName)
  const preview = useSelector((s: RootState) => s.preview)
  
  // Enhanced validation feedback state
  const [validationMessage, setValidationMessage] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({ show: false, type: 'success', message: '' })

  // Submit success state
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const currentSchema = useMemo(() => {
    if (formId) {
      const saved = loadFormById(formId)
      return saved
    }
    
    if (builderFields.length === 0) return null
    return {
      id: 'builder_preview',
      name: formName || 'Form Preview',
      createdAt: new Date().toISOString(),
      fields: builderFields,
    }
  }, [builderFields, formName, formId])

  useEffect(() => {
    if (currentSchema) {
      dispatch(loadFromSchema(currentSchema))
      setSubmitSuccess(false)
    }
  }, [dispatch, currentSchema])

  // Use useEffect to watch for Redux state changes after validation
  useEffect(() => {
    const checkValidationErrors = () => {
      if (!currentSchema) return { hasErrors: false, errorFieldNames: [] }
      
      let hasErrors = false
      const errorFieldNames: string[] = []
      
      console.log('=== CHECKING VALIDATION RESULTS ===')
      console.log('Current preview.errors:', preview.errors)
      console.log('Current preview.derivedErrors:', preview.derivedErrors)
      
      // Check regular field errors
      Object.entries(preview.errors).forEach(([fieldId, error]) => {
        console.log(`Field error: ${fieldId} - ${error}`)
        if (error !== null && error !== '') {
          hasErrors = true
          const field = currentSchema.fields.find(f => f.id === fieldId)
          errorFieldNames.push(field?.label || fieldId)
        }
      })
      
      // Check derived field errors
      Object.entries(preview.derivedErrors).forEach(([fieldId, error]) => {
        console.log(`Derived field error: ${fieldId} - ${error}`)
        if (error !== null && error !== '') {
          hasErrors = true
          const field = currentSchema.fields.find(f => f.id === fieldId)
          errorFieldNames.push(field?.label || fieldId)
        }
      })
      
      console.log('Total errors found:', errorFieldNames.length)
      return { hasErrors, errorFieldNames }
    }

    if (preview.submitAttempted) {
      const validation = checkValidationErrors()
      
      if (!validation.hasErrors) {
        setValidationMessage({
          show: true,
          type: 'success',
          message: `✅ All fields are valid! Form has ${currentSchema?.fields.length || 0} fields.`
        })
        setSubmitSuccess(true)
      } else {
        setValidationMessage({
          show: true,
          type: 'error',
          message: `❌ Found ${validation.errorFieldNames.length} validation error${validation.errorFieldNames.length > 1 ? 's' : ''} in: ${validation.errorFieldNames.join(', ')}`
        })
        setSubmitSuccess(false)
      }

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setValidationMessage(prev => ({ ...prev, show: false }))
      }, 5000)
    }
  }, [preview.errors, preview.derivedErrors, preview.submitAttempted, currentSchema])

  // Enhanced validation function that triggers state update
  const handleValidateAll = () => {
    console.log('=== VALIDATE ALL CLICKED ===')
    
    if (!currentSchema) {
      console.log('No schema available for validation')
      return
    }

    // Dispatch the validateAll action - this will trigger the useEffect above
    dispatch(validateAll())
  }

  // Enhanced form submission with proper validation
  const handleSubmit = () => {
    console.log('=== FORM SUBMIT CLICKED ===')
    
    if (!currentSchema) {
      console.log('No schema available for submission')
      return
    }

    // Dispatch submit action (this will trigger validation and set submitAttempted to true)
    dispatch(submitForm())
  }

  const hasFields = builderFields.length > 0 || (currentSchema?.fields.length || 0) > 0

  return (
    <Stack spacing={3}>
      {/* Header Section */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        justifyContent="space-between"
      >
        <Typography variant="h5">Form Preview</Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined"
            onClick={handleValidateAll}
            color="primary"
          >
            Validate All
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate(formId ? '/myforms' : '/create')}
          >
            {formId ? 'Back to My Forms' : 'Back to Builder'}
          </Button>
        </Stack>
      </Stack>

      {/* Validation Message Alert */}
      {validationMessage.show && (
        <Fade in timeout={300}>
          <Alert 
            severity={validationMessage.type}
            onClose={() => setValidationMessage({ ...validationMessage, show: false })}
            sx={{ mb: 2 }}
          >
            {validationMessage.message}
          </Alert>
        </Fade>
      )}

      {/* Submit Success Message */}
      {submitSuccess && (
        <Fade in timeout={500}>
          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: 'success.light',
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'success.main'
          }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="success.dark">
              Form Submitted Successfully!
            </Typography>
            <Typography variant="body2" color="success.dark">
              All form data has been validated and processed.
            </Typography>
          </Box>
        </Fade>
      )}

      {/* No Fields State */}
      {!hasFields && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Alert severity="info">
            No form fields to preview. Please add fields in the Form Builder first.
          </Alert>
        </Paper>
      )}

      {/* Form Fields Rendering - SUBMIT BUTTON NOW SHOWS FOR BOTH SCENARIOS */}
      {hasFields && currentSchema && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {currentSchema.name}
          </Typography>
          
          {/* Form Fields Grid */}
          <Grid container spacing={2}>
            {currentSchema.fields.map((f) => (
              <Grid key={f.id} size={{ xs: 12, md: 6 }}>
                <FormFieldRenderer
                  field={f}
                  value={preview.values[f.id]}
                  error={preview.errors[f.id]}
                  derivedError={preview.derivedErrors[f.id]}
                  onChange={(id, value) => dispatch(setValue({ id, value }))}
                />
              </Grid>
            ))}
          </Grid>

          {/* SUBMIT BUTTON - NOW APPEARS FOR BOTH BUILDER PREVIEW AND SAVED FORM PREVIEW */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center' 
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={submitSuccess}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: submitSuccess 
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: submitSuccess
                    ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                    : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {submitSuccess ? 'Submitted!' : 'Submit Form'}
            </Button>
          </Box>
        </Paper>
      )}
    </Stack>
  )
}
